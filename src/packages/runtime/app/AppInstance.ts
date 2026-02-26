// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { computed, effect, reactive, ReadonlyReactive } from "@conterra/reactivity-core";
import {
    createAbortError,
    createLogger,
    createManualPromise,
    destroyResource,
    Error,
    ManualPromise,
    Resource,
    throwAbortError
} from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { createElement } from "react";
import { ApiMethods, ApiService, ThemeService } from "../api";
import {
    createBuiltinPackage,
    RUNTIME_API_SERVICE,
    RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE,
    RUNTIME_AUTO_START,
    RUNTIME_THEME_SERVICE
} from "../builtin-services";
import { ApplicationLifecycleEventService } from "../builtin-services/ApplicationLifecycleEventService";
import { DEFAULT_INITIAL_COLOR_MODE } from "../builtin-services/ThemeServiceImpl";
import {
    ApplicationConfig,
    ApplicationOverrides,
    ApplicationProperties,
    CustomElementOptions
} from "../CustomElement";
import { createAppRoot, isShadowRoot, RootNode } from "../dom";
import { ErrorId } from "../errors";
import { AppIntl, createPackageIntl, getBrowserLocales, I18nConfig, initI18n } from "../i18n";
import { PackageMetadata } from "../metadata";
import { ErrorScreen, MESSAGES_BY_LOCALE } from "../react-integration/ErrorScreen";
import { EmptyComponent, ReactIntegration } from "../react-integration/ReactIntegration";
import { ReferenceSpec } from "../service-layer/InterfaceSpec";
import { createPackages, PackageRepr } from "../service-layer/PackageRepr";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { gatherConfig } from "./gatherConfig";

import { SystemConfig } from "@chakra-ui/react";
import { logError } from "./logErrors";

const LOG = createLogger(sourceId);

export interface AppOptions {
    /** The root node that contains the application. */
    rootNode: RootNode;

    /** The HTML element that embeds the application. */
    hostElement: HTMLElement;

    /** Trails options for the application. */
    elementOptions: CustomElementOptions;

    /** These have higher priority than the options in `elementOptions`. */
    overrides: ApplicationOverrides | undefined;

    /**
     * A callback to restart the application with new options.
     * Currently only used for reloading with a certain locale.
     */
    restart: (overrides?: ApplicationOverrides) => void;
}

export type AppState = "not-started" | "starting" | "started" | "destroyed" | "error";

export class AppInstance {
    private options: AppOptions;

    // Public API
    private apiPromise: ManualPromise<ApiMethods> | undefined; // Present when callers are waiting for the API
    private api: ApiMethods | undefined; // Present once started

    private state: AppState = "not-started";
    private rootNode: RootNode;
    private container: HTMLElement | ShadowRoot; // parent of .pioneer-root
    private appRoot: HTMLDivElement | undefined; // .pioneer-root
    private config: ApplicationConfig | undefined;
    private serviceLayer: ServiceLayer | undefined;
    private lifecycleEvents: ApplicationLifecycleEventService | undefined;
    private themeService: ThemeService | undefined;
    private reactIntegration: ReactIntegration | undefined;

    private stylesWatch: Resource | undefined;

    constructor(options: AppOptions) {
        this.options = options;
        this.container = isShadowRoot(options.rootNode) ? options.rootNode : options.hostElement;
        this.rootNode = options.rootNode;
    }

    start() {
        if (this.state !== "not-started") {
            throw new Error(ErrorId.INTERNAL, `Cannot start element in state '${this.state}'`);
        }

        this.state = "starting";
        this.startImpl().catch((e) => {
            if (this.state === "destroyed") return;

            logError(e);
            this.reset();
            this.state = "error";
            this.showErrorScreen(e);
        });
    }

    destroy() {
        if (this.state === "destroyed") {
            return;
        }

        // Only call event listener when 'started' was also signalled.
        if (this.state === "started") {
            try {
                this.triggerApplicationLifecycleEvent("before-stop");
            } catch (e) {
                void e; // Ignored
            }
        }
        this.state = "destroyed";
        this.reset();
    }

    private reset() {
        this.apiPromise?.reject(createAbortError());
        this.reactIntegration = destroyResource(this.reactIntegration);
        this.container.replaceChildren();
        this.appRoot = undefined;
        this.lifecycleEvents = undefined;
        this.themeService = undefined;
        this.serviceLayer = destroyResource(this.serviceLayer);
        this.stylesWatch = destroyResource(this.stylesWatch);
    }

    whenAPI(): Promise<ApiMethods> {
        if (this.api) {
            return Promise.resolve(this.api);
        }

        const apiPromise = (this.apiPromise ??= createManualPromise());
        return apiPromise.promise;
    }

    private async startImpl() {
        const { hostElement, elementOptions, overrides } = this.options;
        const root = this.rootNode;

        // Resolve custom application config
        const config = (this.config = await gatherConfig(hostElement, elementOptions, overrides));
        this.checkAbort();
        LOG.debug("Application config is", config);

        // Decide on locale and load i18n messages (if any).
        const i18n = await initI18n(elementOptions.appMetadata, config.locale);
        this.checkAbort();

        // Setup application root node in the shadow dom
        const appRoot = (this.appRoot = createAppRoot(i18n.locale));
        this.container.appendChild(appRoot);
        const styles = this.initStylesSignal();
        // Launch the service layer
        const { serviceLayer, packages } = this.initServiceLayer({
            container: appRoot,
            properties: config.properties,
            i18n,
            initialChakraSystemConfig:
                config.chakraSystemConfig ?? elementOptions.chakraSystemConfig
        });
        this.lifecycleEvents = getInternalService<ApplicationLifecycleEventService>(
            serviceLayer,
            RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE
        );
        const themeService = (this.themeService = getInternalService<ThemeService>(
            serviceLayer,
            RUNTIME_THEME_SERVICE
        ));

        // init api, but do not wait for it
        const apiPromise = this.initAPI(serviceLayer);
        this.checkAbort();

        // Launch react
        this.reactIntegration = ReactIntegration.createForApp({
            rootNode: root,
            hostNode: hostElement,
            appRoot: appRoot,
            serviceLayer,
            packages,
            locale: i18n.locale,
            config: computed(() => themeService.systemConfig),
            styles,
            colorMode: computed(() => themeService.colorMode)
        });
        const component = this.options.elementOptions.component ?? EmptyComponent;
        this.reactIntegration.render(createElement(component));

        // wait for api, to ensure that the "started" state is only reached after the API is available.
        // but do not block the react rendering, to allow for a fast Time to Interactive and to show potential errors in the UI even if the API fails.
        await apiPromise;
        this.checkAbort();

        this.state = "started";

        this.triggerApplicationLifecycleEvent("after-start");
        LOG.debug("Application started");
    }

    /**
     * Returns a signal that contains the application's styles.
     * During development, the signal is updated when the user edits .css files.
     * In production, the signal is static.
     */
    private initStylesSignal(): ReadonlyReactive<string> {
        const stylesBox = this.options.elementOptions.appMetadata?.styles;
        if (!stylesBox) {
            return reactive("");
        }

        const signal = reactive(stylesBox.value);
        if (import.meta.hot) {
            this.stylesWatch = effect(
                () => {
                    signal.value = stylesBox.value;
                    LOG.debug("Application styles changed");
                },
                { dispatch: "sync" }
            );
        }
        return signal;
    }

    private initServiceLayer(config: {
        container: HTMLDivElement;
        properties: ApplicationProperties;
        i18n: AppIntl;
        initialChakraSystemConfig: SystemConfig | undefined;
    }) {
        const {
            hostElement,
            rootNode: shadowRoot,
            elementOptions,
            restart,
            overrides
        } = this.options;

        const { container, properties, i18n } = config;
        const packageMetadata = elementOptions.appMetadata?.packages ?? {};
        // not yet configurable.
        const colorModeFromConfig = DEFAULT_INITIAL_COLOR_MODE;
        const builtinPackage = createBuiltinPackage({
            host: hostElement,
            rootNode: shadowRoot,
            container: container,
            initialColorMode: overrides?.colorMode ?? colorModeFromConfig,
            initialSystemConfig: overrides?.chakraSystemConfig ?? config.initialChakraSystemConfig,
            locale: i18n.locale,
            supportedLocales: i18n.supportedMessageLocales,
            changeLocale: (locale) => {
                const supported = i18n.supportedMessageLocales;
                if (locale != null && !i18n.supportsLocale(locale)) {
                    const supportedLocales = supported.join(", ");
                    throw new Error(
                        ErrorId.UNSUPPORTED_LOCALE,
                        `Unsupported locale '${locale}' (supported locales: ${supportedLocales}).`
                    );
                }

                // transport color mode only, if not same as initial configured value
                const themeService = this.themeService;
                const currentColorMode = themeService?.colorMode ?? colorModeFromConfig;
                const currentSystemConfig = themeService?.systemConfig;
                const newOverrides: ApplicationOverrides = { locale };
                if (currentColorMode !== colorModeFromConfig) {
                    newOverrides.colorMode = currentColorMode;
                }
                if (currentSystemConfig !== config.initialChakraSystemConfig) {
                    newOverrides.chakraSystemConfig = currentSystemConfig;
                }
                restart(newOverrides);
            }
        });
        const { serviceLayer, packages } = createServiceLayer({
            packageMetadata,
            builtinPackage,
            properties,
            i18n
        });
        this.serviceLayer = serviceLayer;

        if (LOG.isDebug()) {
            LOG.debug("Launching service layer with packages", Object.fromEntries(packages));
        }
        serviceLayer.start();
        return { serviceLayer, packages };
    }

    private async initAPI(serviceLayer: ServiceLayer) {
        const apiService = getInternalService<ApiService>(serviceLayer, RUNTIME_API_SERVICE);
        try {
            const api = await apiService.getApi();
            this.checkAbort();
            this.api = api;
            LOG.debug("Application API initialized to", api);
            this.apiPromise?.resolve(api);
        } catch (e) {
            const ex = new Error(
                ErrorId.INTERNAL,
                "Failed to gather the application's API methods.",
                {
                    cause: e
                }
            );
            if (!this.apiPromise) {
                // no one is waiting yet.
                // keep the error for when they do
                this.apiPromise = createManualPromise();
                // prevent unhandled rejection if no one is waiting for the API
                this.apiPromise.promise.catch(() => {});
            }
            this.apiPromise.reject(ex);
            throw ex;
        }
    }

    private triggerApplicationLifecycleEvent(event: "after-start" | "before-stop") {
        this.lifecycleEvents?.emitLifecycleEvent(event);
    }

    private checkAbort() {
        if (this.state === "destroyed") {
            throwAbortError();
        }
    }

    private showErrorScreen(error: globalThis.Error) {
        const userLocales = getBrowserLocales();
        const i18nConfig = new I18nConfig(Object.keys(MESSAGES_BY_LOCALE));
        const { locale, messageLocale } = i18nConfig.pickSupportedLocale(undefined, userLocales);
        const messages =
            MESSAGES_BY_LOCALE[messageLocale as keyof typeof MESSAGES_BY_LOCALE] ??
            MESSAGES_BY_LOCALE["en"];
        const intl = createPackageIntl(locale, messages);

        const appRoot = (this.appRoot = createAppRoot(locale));
        appRoot.classList.add("pioneer-root-error-screen");
        this.container.appendChild(appRoot);

        const styles = this.initStylesSignal();

        this.reactIntegration = ReactIntegration.createForErrorScreen({
            rootNode: this.rootNode,
            hostNode: this.options.hostElement,
            appRoot: appRoot,
            locale: locale,
            config: reactive(this.options.elementOptions.chakraSystemConfig),
            styles,
            colorMode: reactive(DEFAULT_INITIAL_COLOR_MODE)
        });
        this.reactIntegration.render(createElement(ErrorScreen, { intl, error }));
    }
}

function createServiceLayer(config: {
    packageMetadata: Record<string, PackageMetadata> | undefined;
    properties: ApplicationProperties;
    builtinPackage: PackageRepr;
    i18n: AppIntl;
}) {
    const { packageMetadata, properties, builtinPackage, i18n } = config;

    let packages: PackageRepr[];
    try {
        packages = createPackages(packageMetadata ?? {}, i18n, properties);
    } catch (e) {
        throw new Error(ErrorId.INVALID_METADATA, "Failed to parse package metadata.", {
            cause: e
        });
    }

    // Add builtin services defined within this package.
    {
        const index = packages.findIndex((pkg) => pkg.name === builtinPackage.name);
        if (index >= 0) {
            packages.splice(index, 1);
        }
        packages.push(builtinPackage);
    }

    // Automatically required references (-> forces services to start)
    const forcedReferences: ReferenceSpec[] = [
        {
            interfaceName: RUNTIME_API_SERVICE
        },
        {
            interfaceName: RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE
        },
        {
            interfaceName: RUNTIME_THEME_SERVICE
        },
        {
            interfaceName: RUNTIME_AUTO_START,
            all: true
        }
    ];
    const serviceLayer = new ServiceLayer(packages, forcedReferences);
    return {
        packages: new Map(packages.map((pkg) => [pkg.name, pkg])),
        serviceLayer: serviceLayer
    };
}

function getInternalService<T = unknown>(serviceLayer: ServiceLayer, interfaceName: string) {
    const result = serviceLayer.getService(
        "@open-pioneer/runtime",
        {
            interfaceName
        },
        { ignoreDeclarationCheck: true }
    );
    if (result.type !== "found") {
        throw new Error(
            ErrorId.INTERNAL,
            `Failed to find instance of '${interfaceName}' (result type '${result.type}').` +
                ` This is a builtin service that must be present exactly once.`
        );
    }

    return result.value.getInstanceOrThrow() as T;
}
