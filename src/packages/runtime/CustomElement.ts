// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ComponentType, createElement } from "react";
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
import { ErrorId } from "./errors";
import { ApplicationMetadata, PackageMetadata } from "./metadata";
import { PackageRepr, createPackages } from "./service-layer/PackageRepr";
import { ServiceLayer } from "./service-layer/ServiceLayer";
import { getErrorChain } from "@open-pioneer/core";
import { ReactIntegration } from "./react-integration/ReactIntegration";
import { ApiMethods, ApiService } from "./api";
import {
    createBuiltinPackage,
    RUNTIME_API_SERVICE,
    RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE,
    RUNTIME_AUTO_START
} from "./builtin-services";
import { ReferenceSpec } from "./service-layer/InterfaceSpec";
import { AppI18n, createPackageIntl, getBrowserLocales, I18nConfig, initI18n } from "./i18n";
import { ApplicationLifecycleEventService } from "./builtin-services/ApplicationLifecycleEventService";
import { ErrorScreen, MESSAGES_BY_LOCALE } from "./ErrorScreen";
const LOG = createLogger("runtime:CustomElement");

/**
 * Options for the {@link createCustomElement} function.
 */
export interface CustomElementOptions {
    /**
     * Rendered UI component.
     */
    component?: ComponentType<Record<string, string>>;

    /**
     * Application metadata (packages, services etc.).
     * This is usually autogenerated by importing the virtual `"open-pioneer:app"` module.
     */
    appMetadata?: ApplicationMetadata;

    /**
     * Application defined configuration.
     *
     * This option can be used to override default properties of the application's packages.
     *
     * All instances of the web component will share this static configuration.
     */
    config?: ApplicationConfig;

    /**
     * Function to provide additional application defined configuration parameters.
     *
     * Compared to {@link config}, this function receives a context object
     * that allows the developer to provide dynamic properties on a per-application instance basis.
     *
     * Parameters returned by this function take precedence over the ones defined by {@link config}.
     */
    resolveConfig?(ctx: ConfigContext): Promise<ApplicationConfig | undefined>;

    /**
     * Chakra theming object.
     */
    theme?: Record<string, unknown>;
}

/**
 * A context object that is passed to the `resolveProperties` function.
 */
export interface ConfigContext {
    /**
     * The application's host element.
     */
    hostElement: HTMLElement;

    /**
     * Returns an attribute from the application's root node.
     */
    getAttribute(name: string): string | undefined;
}

/**
 * Runtime application configuration.
 */
export interface ApplicationConfig {
    /**
     * Set this value to a locale string (e.g. "en") to for the application's locale.
     * The default behavior is to choose an appropriate locale for the current user based
     * on the browser's settings.
     *
     * The locale must be supported by the application.
     */
    locale?: string | undefined;

    /**
     * Properties specified here will override default properties of the application's packages.
     */
    properties?: ApplicationProperties | undefined;
}

/**
 * Allows the application to override default properties in all packages.
 *
 * Properties are typed when the package contains type definitions for them.
 */
export interface ApplicationProperties {
    /**
     * Key: the name of the package.
     * Value: A record of configuration properties (key/value pairs).
     *
     * Properties will override default property values in the package.
     */
    [packageName: string]: Record<string, unknown>;
}

/**
 * The interface implemented by web components produced via {@link createCustomElement}.
 */
export interface ApplicationElement extends HTMLElement {
    /** Resolves to the element's API when the application has started. */
    when(): Promise<ApiMethods>;
}

/**
 * The class returned by a call to {@link createCustomElement}.
 */
export interface ApplicationElementConstructor {
    new (): ApplicationElement;
}

/**
 * Creates a new custom element class (web component) that can be registered within a DOM.
 *
 * @example
 * ```ts
 * import * as appMetadata from "open-pioneer:app";
 *
 * const CustomElementClazz = createCustomElement({
 *   component: <div>Hello World!</div>,
 *   appMetadata
 * });
 * customElements.define("sample-element", CustomElementClazz);
 * ```
 */
export function createCustomElement(options: CustomElementOptions): ApplicationElementConstructor {
    class PioneerApplication extends HTMLElement implements ApplicationElement {
        #shadowRoot: ShadowRoot;
        #instance: ApplicationInstance | undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        #deferredRestart: any; // A Timer

        static get observedAttributes(): string[] {
            return [];
        }

        constructor() {
            super();

            this.#shadowRoot = this.attachShadow({
                mode: "open"
            });

            if (import.meta.env.DEV) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this as any).$inspectElementState = () => this.#instance;
            }
        }

        connectedCallback() {
            LOG.debug("Launching application");

            if (this.#instance) {
                this.#instance.destroy();
            }

            this.#instance = this.#createApplicationInstance();
            this.#instance.start();
        }

        disconnectedCallback() {
            LOG.debug("Shutting down application");

            if (this.#deferredRestart) {
                clearTimeout(this.#deferredRestart);
            }
            this.#instance?.destroy();
            this.#instance = undefined;

            LOG.debug("Application destroyed");
        }

        when() {
            if (!this.#instance) {
                return Promise.reject(
                    new Error(
                        ErrorId.NOT_MOUNTED,
                        "Cannot use the application's API because the HTML element has not yet been mounted into the DOM."
                    )
                );
            }

            return this.#instance.whenAPI();
        }

        #triggerReload(overrides?: ApplicationOverrides) {
            // Defer the restart operation a tiny bit so calling code does not get surprised by the application's destruction.
            if (this.#deferredRestart) {
                clearTimeout(this.#deferredRestart);
            }
            this.#deferredRestart = setTimeout(() => {
                if (!this.#instance) {
                    // disconnectedCallback was called in the meantime
                    return;
                }

                LOG.debug("Restarting application with new options", overrides);
                this.#instance.destroy();
                this.#instance = this.#createApplicationInstance(overrides);
                this.#instance.start();
            }, 1);
        }

        #createApplicationInstance(overrides?: ApplicationOverrides) {
            return new ApplicationInstance({
                hostElement: this,
                shadowRoot: this.#shadowRoot,
                elementOptions: options,
                overrides: overrides,
                restart: this.#triggerReload.bind(this)
            });
        }
    }
    return PioneerApplication;
}

interface InstanceOptions {
    /** The HTML element that embeds the application. */
    hostElement: HTMLElement;

    /** The shadow root inside the host element that contains the rest of the application. */
    shadowRoot: ShadowRoot;

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

interface ApplicationOverrides {
    locale?: string;
}

type ApplicationState = "not-started" | "starting" | "started" | "destroyed" | "error";

class ApplicationInstance {
    private options: InstanceOptions;

    // Public API
    private apiPromise: ManualPromise<ApiMethods> | undefined; // Present when callers are waiting for the API
    private api: ApiMethods | undefined; // Present once started

    private state: ApplicationState = "not-started";
    private container: HTMLDivElement | undefined;
    private config: ApplicationConfig | undefined;
    private serviceLayer: ServiceLayer | undefined;
    private lifecycleEvents: ApplicationLifecycleEventService | undefined;
    private reactIntegration: ReactIntegration | undefined;
    private stylesWatch: Resource | undefined;

    constructor(options: InstanceOptions) {
        this.options = options;
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
        this.options.shadowRoot.replaceChildren();
        this.container = undefined;
        this.lifecycleEvents = undefined;
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
        const { shadowRoot, hostElement, elementOptions, overrides } = this.options;

        // Resolve custom application config
        const config = (this.config = await gatherConfig(hostElement, elementOptions, overrides));
        this.checkAbort();
        LOG.debug("Application config is", config);

        // Decide on locale and load i18n messages (if any).
        const i18n = await initI18n(elementOptions.appMetadata, config.locale);
        this.checkAbort();

        // Setup application root node in the shadow dom
        const container = (this.container = createContainer(i18n.locale));
        const styles = this.initStyles();
        shadowRoot.replaceChildren(container, ...styles);

        // Launch the service layer
        const { serviceLayer, packages } = this.initServiceLayer({
            container,
            properties: config.properties,
            i18n
        });
        this.lifecycleEvents = getInternalService<ApplicationLifecycleEventService>(
            serviceLayer,
            RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE
        );

        await this.initAPI(serviceLayer);
        this.checkAbort();

        // Launch react
        this.reactIntegration = ReactIntegration.createForApp({
            rootNode: container,
            container: shadowRoot,
            theme: elementOptions.theme,
            serviceLayer,
            packages
        });
        const component = this.options.elementOptions.component ?? emptyComponent;
        this.reactIntegration.render(createElement(component));
        this.state = "started";

        this.triggerApplicationLifecycleEvent("after-start");
        LOG.debug("Application started");
    }

    private initStyles() {
        // Prevent inheritance of certain css values and normalize to display: block by default.
        // See https://open-wc.org/guides/knowledge/styling/styles-piercing-shadow-dom/
        const builtinStyles = ":host { all: initial; display: block; }";
        const builtinStylesNode = document.createElement("style");
        applyStyles(builtinStylesNode, { value: builtinStyles });

        const appStyles = this.options.elementOptions.appMetadata?.styles;
        const appStylesNode = document.createElement("style");
        applyStyles(appStylesNode, appStyles);
        if (import.meta.hot) {
            this.stylesWatch = appStyles?.on?.("changed", () => {
                LOG.debug("Application styles changed");
                applyStyles(appStylesNode, appStyles);
            });
        }
        return [builtinStylesNode, appStylesNode];
    }

    private initServiceLayer(config: {
        container: HTMLDivElement;
        properties: ApplicationProperties;
        i18n: AppI18n;
    }) {
        const { hostElement, shadowRoot, elementOptions, restart } = this.options;
        const { container, properties, i18n } = config;
        const packageMetadata = elementOptions.appMetadata?.packages ?? {};
        const builtinPackage = createBuiltinPackage({
            host: hostElement,
            shadowRoot: shadowRoot,
            container: container,
            locale: i18n.locale,
            supportedLocales: i18n.supportedMessageLocales,
            changeLocale(locale) {
                const supported = i18n.supportedMessageLocales;
                if (locale != null && !i18n.supportsLocale(locale)) {
                    throw new Error(
                        ErrorId.UNSUPPORTED_LOCALE,
                        `Unsupported locale '${locale}' (supported locales: ${supported.join(
                            ", "
                        )}).`
                    );
                }
                restart({ locale });
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
            const api = (this.api = await apiService.getApi());
            LOG.debug("Application API initialized to", api);
            this.apiPromise?.resolve(api);
        } catch (e) {
            throw new Error(ErrorId.INTERNAL, "Failed to gather the application's API methods.", {
                cause: e
            });
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
        const { shadowRoot, elementOptions } = this.options;

        const userLocales = getBrowserLocales();
        const i18nConfig = new I18nConfig(Object.keys(MESSAGES_BY_LOCALE));
        const { locale, messageLocale } = i18nConfig.pickSupportedLocale(undefined, userLocales);

        const container = (this.container = createContainer(locale));
        container.classList.add("pioneer-root-error-screen");

        const messages =
            MESSAGES_BY_LOCALE[messageLocale as keyof typeof MESSAGES_BY_LOCALE] ??
            MESSAGES_BY_LOCALE["en"];
        const intl = createPackageIntl(locale, messages);
        this.reactIntegration = ReactIntegration.createForErrorScreen({
            rootNode: container,
            container: shadowRoot,
            theme: elementOptions.theme
        });
        this.reactIntegration.render(createElement(ErrorScreen, { intl, error }));

        shadowRoot.replaceChildren(container);
    }
}

function createContainer(locale: string) {
    // Setup application root node in the shadow dom
    const container = document.createElement("div");
    container.classList.add("pioneer-root");
    container.style.minHeight = "100%";
    container.style.height = "100%";
    if (locale) {
        container.lang = locale;
    }
    return container;
}

function createServiceLayer(config: {
    packageMetadata: Record<string, PackageMetadata> | undefined;
    properties: ApplicationProperties;
    builtinPackage: PackageRepr;
    i18n: AppI18n;
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

/**
 * Gathers application properties by reading them from the options object
 * and by (optionally) invoking the `resolveProperties` hook.
 */
async function gatherConfig(
    hostElement: HTMLElement,
    options: CustomElementOptions,
    overrides?: ApplicationOverrides
) {
    let configs: ApplicationConfig[];
    try {
        const staticConfig = options.config ?? {};
        const dynamicConfig =
            (await options.resolveConfig?.({
                hostElement,
                getAttribute(name) {
                    return hostElement.getAttribute(name) ?? undefined;
                }
            })) ?? {};

        configs = [staticConfig, dynamicConfig];
    } catch (e) {
        throw new Error(
            ErrorId.CONFIG_RESOLUTION_FAILED,
            "Failed to resolve application properties.",
            {
                cause: e
            }
        );
    }

    const merged = mergeConfigs(configs);
    if (overrides?.locale) {
        merged.locale = overrides.locale;
    }
    return merged;
}

/**
 * Merges application configurations into a single object.
 * Properties / config parameters at a later position overwrite properties from earlier ones.
 */
function mergeConfigs(configs: ApplicationConfig[]): Required<ApplicationConfig> {
    // Merge simple values by assigning them in order
    const mergedConfig: Required<ApplicationConfig> = Object.assign(
        {
            locale: undefined,
            properties: {}
        } satisfies ApplicationConfig,
        ...configs
    );

    // Deep merge for application properties
    const mergedProperties: ApplicationProperties = (mergedConfig.properties = {});
    for (const config of configs) {
        for (const [packageName, packageProperties] of Object.entries(config.properties ?? {})) {
            const mergedPackageProps = (mergedProperties[packageName] ??= {});
            Object.assign(mergedPackageProps, packageProperties);
        }
    }

    return mergedConfig;
}

// Applies application styles to the given style node.
// Can be called multiple times in development mode to implement hot reloading.
function applyStyles(styleNode: HTMLStyleElement, styles: { value: string } | undefined) {
    let cssValue = styles?.value ?? "";
    // Remove sourcemaps from inline css.
    // This currently does not work because a) the 'importer' (the index.html file) does not
    // match the actual path the source map would exist and b) vite refuses to generate it anyway, probably
    // because of our virtual modules.
    // TODO: both should be fixed once we can refer to actual `.css` files
    // and don't have to embed inline css anymore.
    cssValue = cssValue.replace(/\/\*# sourceMappingURL=.*$/, "");
    const cssNode = document.createTextNode(cssValue);
    styleNode.replaceChildren(cssNode);
}

function logError(e: unknown) {
    if (e instanceof Error) {
        const chain = getErrorChain(e).reverse();
        if (chain.length === 1) {
            console.error(e);
            return;
        }

        let n = 1;
        for (const error of chain) {
            console.error(`#${n}`, error);
            ++n;
        }
    } else {
        console.error("Unexpected error", e);
    }
}

function emptyComponent() {
    return null;
}
