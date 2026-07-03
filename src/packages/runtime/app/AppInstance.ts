// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    computed,
    constant,
    effect,
    reactive,
    ReadonlyReactive,
    watchValue
} from "@conterra/reactivity-core";
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
import { ApiMethods, ApiService, ColorModeValue, ThemeService } from "../api";
import {
    createBuiltinPackage,
    RUNTIME_API_SERVICE,
    RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE,
    RUNTIME_AUTO_START,
    RUNTIME_LOCALE_SERVICE,
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
import { AppIntl, createPackageIntl, getBrowserLocales, LocalePicker, parseLocale } from "../i18n";
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
    #options: AppOptions;

    // Public API
    #apiPromise: ManualPromise<ApiMethods> | undefined; // Present when callers are waiting for the API
    #api: ApiMethods | undefined; // Present once started

    #state: AppState = "not-started";
    #rootNode: RootNode;
    #container: HTMLElement | ShadowRoot; // parent of .pioneer-root
    #i18n: AppIntl | undefined;

    // Unused on purpose for easier debugging.
    // oxlint-disable-next-line no-unused-private-class-members
    #appRoot: HTMLDivElement | undefined; // .pioneer-root

    // Unused on purpose for easier debugging.
    // oxlint-disable-next-line no-unused-private-class-members
    #config: ApplicationConfig | undefined;

    #serviceLayer: ServiceLayer | undefined;
    #lifecycleEvents: ApplicationLifecycleEventService | undefined;
    #themeService: ThemeService | undefined;
    #reactIntegration: ReactIntegration | undefined;

    #stylesWatch: Resource | undefined;
    #localeWatch: Resource | undefined;

    constructor(options: AppOptions) {
        this.#options = options;
        this.#container = isShadowRoot(options.rootNode) ? options.rootNode : options.hostElement;
        this.#rootNode = options.rootNode;
    }

    /** Current lifecycle state. Exposed (read-only) for tests/debugging via `$inspectElementState`. */
    get state(): AppState {
        return this.#state;
    }

    start() {
        if (this.#state !== "not-started") {
            throw new Error(ErrorId.INTERNAL, `Cannot start element in state '${this.#state}'`);
        }

        this.#state = "starting";
        this.#startImpl().catch((e) => {
            if (this.#state === "destroyed") return;

            logError(e);
            this.#reset();
            this.#state = "error";
            this.#showErrorScreen(e);
        });
    }

    destroy() {
        if (this.#state === "destroyed") {
            return;
        }

        // Only call event listener when 'started' was also signalled.
        if (this.#state === "started") {
            try {
                this.#triggerApplicationLifecycleEvent("before-stop");
            } catch (e) {
                void e; // Ignored
            }
        }
        this.#state = "destroyed";
        this.#reset();
    }

    #reset() {
        this.#apiPromise?.reject(createAbortError());
        this.#reactIntegration = destroyResource(this.#reactIntegration);
        this.#container.replaceChildren();
        this.#appRoot = undefined;
        this.#lifecycleEvents = undefined;
        this.#themeService = undefined;
        this.#i18n = destroyResource(this.#i18n);
        this.#serviceLayer = destroyResource(this.#serviceLayer);
        this.#stylesWatch = destroyResource(this.#stylesWatch);
        this.#localeWatch = destroyResource(this.#localeWatch);
    }

    whenAPI(): Promise<ApiMethods> {
        if (this.#api) {
            return Promise.resolve(this.#api);
        }

        const apiPromise = (this.#apiPromise ??= createManualPromise());
        return apiPromise.promise;
    }

    async #startImpl() {
        const { hostElement, elementOptions, overrides } = this.#options;
        const root = this.#rootNode;

        // Resolve custom application config
        const config = (this.#config = await gatherConfig(hostElement, elementOptions, overrides));
        this.#checkAbort();
        LOG.debug("Application config is", config);

        // TODO (next major): always true (option can be removed).
        // Currently false by default (needs to be enabled) to preserve backwards compatibility.
        const enableLiveLocaleChanges = elementOptions.advanced?.enableLiveLocaleChanges ?? false;

        // TODO (next major): Remove restarting code!
        const restartWithLocale = (locale: Intl.Locale | undefined) => {
            // this code is triggered, when the app calls changeLocale while reactive switching is disabled.
            const restart = this.#options.restart;
            const themeService = this.#themeService;
            const colorMode = themeService?.colorMode;
            const chakraSystemConfig = themeService?.systemConfig;
            restart({ locale: locale?.baseName, colorMode, chakraSystemConfig });
        };

        // Decide on locale and load i18n messages (if any).
        const i18n = (this.#i18n = await AppIntl.create({
            appMetadata: elementOptions.appMetadata,
            forcedLocale: config.locale,
            restrictSupportedLocales: config.supportedLocales,
            supportsLiveChanges: enableLiveLocaleChanges,
            restartWithLocale
        }));
        this.#checkAbort();

        // Setup application root node in the shadow dom
        const appRoot = (this.#appRoot = createAppRoot());
        this.#localeWatch = watchValue(
            () => i18n.locale.baseName,
            (locale) => {
                appRoot.lang = locale;
            },
            {
                immediate: true
            }
        );
        this.#container.appendChild(appRoot);

        const styles = this.#initStylesSignal();

        // Launch the service layer
        const { serviceLayer, packages } = this.#initServiceLayer({
            container: appRoot,
            properties: config.properties,
            i18n,
            initialColorMode: config.colorMode,
            initialSystemConfig: config.chakraSystemConfig
        });
        this.#lifecycleEvents = getInternalService<ApplicationLifecycleEventService>(
            serviceLayer,
            RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE
        );
        const themeService = (this.#themeService = getInternalService<ThemeService>(
            serviceLayer,
            RUNTIME_THEME_SERVICE
        ));

        // init api, but do not wait for it
        const apiPromise = this.#initAPI(serviceLayer);
        this.#checkAbort();

        // Launch react
        this.#reactIntegration = ReactIntegration.createForApp({
            rootNode: root,
            hostNode: hostElement,
            appRoot: appRoot,
            serviceLayer,
            packages,
            locale: computed(() => i18n.locale.baseName),
            config: computed(() => themeService.systemConfig),
            styles,
            colorMode: computed(() => themeService.colorMode)
        });
        const component = this.#options.elementOptions.component ?? EmptyComponent;
        this.#reactIntegration.render(createElement(component));

        // wait for api, to ensure that the "started" state is only reached after the API is available.
        // but do not block the react rendering, to allow for a fast Time to Interactive and to show potential errors in the UI even if the API fails.
        await apiPromise;
        this.#checkAbort();

        this.#state = "started";

        this.#triggerApplicationLifecycleEvent("after-start");
        LOG.debug("Application started");
    }

    /**
     * Returns a signal that contains the application's styles.
     * During development, the signal is updated when the user edits .css files.
     * In production, the signal is static.
     */
    #initStylesSignal(): ReadonlyReactive<string> {
        const stylesBox = this.#options.elementOptions.appMetadata?.styles;
        if (!stylesBox) {
            return constant("");
        }

        const signal = reactive(stylesBox.value);
        if (import.meta.hot) {
            this.#stylesWatch = effect(
                () => {
                    signal.value = stylesBox.value;
                    LOG.debug("Application styles changed");
                },
                { dispatch: "sync" }
            );
        }
        return signal;
    }

    #initServiceLayer(config: {
        container: HTMLDivElement;
        properties: ApplicationProperties;
        i18n: AppIntl;
        initialColorMode: ColorModeValue | "system" | undefined;
        initialSystemConfig: SystemConfig | undefined;
    }) {
        const { hostElement, rootNode: shadowRoot, elementOptions } = this.#options;
        const { container, properties, i18n, initialColorMode, initialSystemConfig } = config;

        const packageMetadata = elementOptions.appMetadata?.packages ?? {};
        const builtinPackage = createBuiltinPackage({
            host: hostElement,
            rootNode: shadowRoot,
            container: container,
            initialColorMode,
            initialSystemConfig,
            appIntl: i18n
        });
        const { serviceLayer, packages } = createServiceLayer({
            packageMetadata,
            builtinPackage,
            properties,
            i18n
        });
        this.#serviceLayer = serviceLayer;

        if (LOG.isDebug()) {
            LOG.debug("Launching service layer with packages", Object.fromEntries(packages));
        }
        serviceLayer.start();
        return { serviceLayer, packages };
    }

    async #initAPI(serviceLayer: ServiceLayer) {
        const apiService = getInternalService<ApiService>(serviceLayer, RUNTIME_API_SERVICE);
        try {
            const api = await apiService.getApi();
            this.#checkAbort();
            this.#api = api;
            LOG.debug("Application API initialized to", api);
            this.#apiPromise?.resolve(api);
        } catch (e) {
            const ex = new Error(
                ErrorId.INTERNAL,
                "Failed to gather the application's API methods.",
                {
                    cause: e
                }
            );
            if (!this.#apiPromise) {
                // no one is waiting yet.
                // keep the error for when they do
                this.#apiPromise = createManualPromise();
                // prevent unhandled rejection if no one is waiting for the API
                this.#apiPromise.promise.catch(() => {});
            }
            this.#apiPromise.reject(ex);
            throw ex;
        }
    }

    #triggerApplicationLifecycleEvent(event: "after-start" | "before-stop") {
        this.#lifecycleEvents?.emitLifecycleEvent(event);
    }

    #checkAbort() {
        if (this.#state === "destroyed") {
            throwAbortError();
        }
    }

    #showErrorScreen(error: globalThis.Error) {
        const userLocales = getBrowserLocales();
        const localePicker = new LocalePicker(
            Object.keys(MESSAGES_BY_LOCALE).map((tag) => parseLocale(tag))
        );
        const { locale, messageLocale } = localePicker.pickSupportedLocale(undefined, userLocales);
        const messages =
            MESSAGES_BY_LOCALE[messageLocale.baseName as keyof typeof MESSAGES_BY_LOCALE] ??
            MESSAGES_BY_LOCALE["en"];
        const intl = createPackageIntl(locale.baseName, messages);

        const appRoot = (this.#appRoot = createAppRoot());
        appRoot.lang = locale.baseName;
        appRoot.classList.add("pioneer-root-error-screen");
        this.#container.appendChild(appRoot);

        const styles = this.#initStylesSignal();

        this.#reactIntegration = ReactIntegration.createForErrorScreen({
            rootNode: this.#rootNode,
            hostNode: this.#options.hostElement,
            appRoot: appRoot,
            locale: constant(locale.baseName),
            config: constant(this.#options.elementOptions.chakraSystemConfig),
            styles,
            colorMode: constant(DEFAULT_INITIAL_COLOR_MODE)
        });
        this.#reactIntegration.render(createElement(ErrorScreen, { intl, error }));
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
            interfaceName: RUNTIME_LOCALE_SERVICE
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
