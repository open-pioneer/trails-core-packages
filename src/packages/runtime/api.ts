// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { type SystemConfig as ChakraSystemConfig } from "@chakra-ui/react";
import type { ApplicationConfig } from "./CustomElement";
import { type DeclaredService } from "./DeclaredService";
import { type Locale } from "./i18n";

export { Locale } from "./i18n";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiMethod = (...args: any[]) => any;

/**
 * A record of exposed functions.
 */
export type ApiMethods = Record<string, ApiMethod>;

/**
 * Provides a set of methods to the application's web component API.
 */
export interface ApiExtension {
    /**
     * Returns a set of methods that will be added to the web component's API.
     */
    getApiMethods(): Promise<ApiMethods> | ApiMethods;
}

/**
 * A service provided by the system.
 * Used by the runtime to assemble the public facing API.
 */
export interface ApiService extends DeclaredService<"runtime.ApiService"> {
    /**
     * Called by the runtime to gather methods that should be available from the web component's API.
     */
    getApi(): Promise<ApiMethods>;
}

/**
 * A service provided by the system, useful for accessing values that are global to the application.
 */
export interface ApplicationContext extends DeclaredService<"runtime.ApplicationContext"> {
    /**
     * The web component's host element.
     * This dom node can be accessed by the host site.
     */
    getHostElement(): HTMLElement;

    /**
     * A root node that resolves to the the shadow root or the site's document.
     *
     * For example:
     *
     * ```ts
     * const ctx: ApplicationContext = ...;
     * const node = ctx.getRoot().getElementById("id"); // Correct with or without shadow root.
     * ```
     */
    getRoot(): Document | ShadowRoot;

    /**
     * The current web component's shadow root.
     * This shadow root is located inside the host element.
     *
     * NOTE: This method returns undefined if the application does not use a shadow root.
     *
     * See also {@link ApplicationConfig.disableShadowRoot} and {@link getRoot()}.
     */
    getShadowRoot(): ShadowRoot | undefined;

    /**
     * The HTML element containing the rest of the application _inside_ the current web component.
     *
     * This element can be used as a root component to find other dom elements within the same application,
     * for example:
     *
     * ```
     * // Correct:
     * const node = ctx.getApplicationContainer().querySelector('.my-element');
     *
     * // Incorrect because cannot search in shadow roots
     * const node = document.querySelector('.my-element');
     * ```
     */
    getApplicationContainer(): HTMLElement;

    /**
     * Returns the current locale of the application.
     *
     * E.g. `"de-DE"`
     *
     * @deprecated Use {@link LocaleService.locale} instead.
     */
    getLocale(): string;

    /**
     * Changes the application's locale.
     * `locale` must be one of the supported locales, see {@link getSupportedLocales()} or `undefined` (for automatic locale).
     * Note that `locale` does not need to be a precise match, e.g. `"de-DE"` is also valid if `"de"` is supported.
     *
     * > NOTE: This method will currently trigger a full restart of the application.
     * > Altering the locale on the fly is possible in theory but has not been implemented yet.
     *
     * @deprecated Use {@link LocaleService.setLocale} instead.
     */
    setLocale(locale: string | undefined): void;

    /**
     * Returns the locales supported by the application, i.e.
     * the locales that have associated i18n messages.
     *
     * For example: `["de", "en"]`
     * @deprecated Use {@link LocaleService.supportedMessageLocales} instead.
     */
    getSupportedLocales(): readonly string[];
}

/**
 * A service to inspect and control the application's active locale.
 *
 * The properties `locale` and `messageLocale` are reactive (powered by
 * `@conterra/reactivity-core`) and can be observed with `useReactiveSnapshot`
 * inside React components.
 *
 * ### `locale` vs `messageLocale`
 *
 * - {@link locale} is the locale used for `Intl`-based formatting
 *   (numbers, dates, relative time, ...). It tracks the user's preferred locale
 *   precisely, e.g. `de-AT`.
 * - {@link messageLocale} is the locale of the currently loaded message bundle.
 *   It is always one of {@link supportedMessageLocales}, e.g. `de`. A language
 *   toggler should use this value to highlight the active button.
 *
 * ### Reactive switching
 *
 * By default, {@link setLocale} triggers a full application restart. When the
 * application opts in by setting `enableLocaleReactiveSwitching` in the
 * {@link AdvancedCustomElementOptions}, the locale is updated in place: the new
 * message bundle is loaded first, then `locale`, `messageLocale` and all
 * `PackageIntl` instances are updated atomically.
 *
 * Watching `messageLocale` is therefore the canonical way to detect that a
 * locale switch has fully completed (the value updates only after the new
 * messages have loaded).
 */
export interface LocaleService extends DeclaredService<"runtime.LocaleService"> {
    /**
     * Reactive: the active locale used for Intl-based formatting.
     * This locale may not match any of the supported message locales,
     * but it always tracks the user's preferred locale as closely as possible (e.g. `de-AT` instead of `de` if `de-AT` is supported).
     */
    readonly locale: Locale;

    /**
     * Reactive: the active message bundle locale.
     * If supportedMessageLocales is empty, this falls back to `en`.
     */
    readonly messageLocale: Locale;

    /**
     * Locales for which the application has translated messages.
     * This list may be empty, if the application has no message bundles.
     */
    readonly supportedMessageLocales: readonly Locale[];

    /**
     * Read-only mirror of the resolved reactive-switching setting,
     * see {@link AdvancedCustomElementOptions.enableLocaleReactiveSwitching}.
     */
    readonly isReactiveSwitching: boolean;

    /**
     * Switches to the given locale.
     *
     * - Pass a {@link Locale} or `undefined` to re-pick from the user's browser
     *   preference.
     * - In reactive-switching mode the change applies in place. Otherwise the
     *   application restarts.
     */
    setLocale(locale: Locale | undefined): Promise<void>;

    /**
     * Returns `true` if it is supported by the application and useable in setLocale.
     */
    supportsLocale(locale: Locale): boolean;
}

/**
 * Implementing this interface allows a service to be notified on certain
 * application-wide lifecycle events.
 *
 * **Experimental**. This interface is not affected by semver guarantees.
 * It may change (or be removed) in a future minor release.
 */
export interface ApplicationLifecycleListener extends DeclaredService<"runtime.ApplicationLifecycleListener"> {
    /**
     * Called after all services required by the application have been started.
     */
    afterApplicationStart?(): void;

    /**
     * Called during the application shutdown just before services will be destroyed.
     */
    beforeApplicationStop?(): void;
}

/**
 * A service that allows to parse numbers from strings according to the current locale.
 */
export interface NumberParserService extends DeclaredService<"runtime.NumberParserService"> {
    /**
     * Parses a number from a string according to the current locale.
     */
    parseNumber(numberString: string): number;
}

/**
 * A color mode value, either "light" or "dark".
 */
export type ColorModeValue = "light" | "dark";

/**
 * A function that returns a ColorModeValue.
 * If it uses a reactive value internally, the ThemeService will react to changes of the color mode.
 */
export type ColorModeValueSupplier = () => ColorModeValue;

/**
 * A function that returns a SystemConfig.
 * If it uses a reactive value internally, the ThemeService will react to changes of the system config.
 */
export type ChakraSystemConfigSupplier = () => ChakraSystemConfig | undefined;

/**
 * A Theme Service that provides methods to interact with the chakra theme.
 *
 * e.g. change the color mode of the application.
 * or update the system config of the application.
 */
export interface ThemeService extends DeclaredService<"runtime.ThemeService"> {
    /**
     * The color mode preferred by the system (browser or operating system).
     */
    readonly systemColorMode: ColorModeValue;

    /**
     * The currently active color mode.
     * It is reactive.
     * Defaults to `"light".
     */
    readonly colorMode: ColorModeValue;

    /**
     * Updates the color mode of the application.
     * Can be called with a direct value or a function that returns a value.
     * The function form allows the use of reactive values, which will automatically trigger a color mode update.
     */
    setColorMode(value: ColorModeValue | "system" | ColorModeValueSupplier): void;

    /**
     * The currently active system config.
     */
    readonly systemConfig: ChakraSystemConfig | undefined;

    /**
     * Updates the system config of the application.
     * Can be called with a direct value or a function that returns a value.
     * The function form allows the use of reactive values, which will automatically trigger a system config update.
     */
    setSystemConfig(value: ChakraSystemConfig | ChakraSystemConfigSupplier | undefined): void;
}
