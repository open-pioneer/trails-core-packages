// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { DeclaredService } from "./DeclaredService";

// Imported for typedoc link
// eslint-disable-next-line unused-imports/no-unused-imports
import type { ApplicationConfig } from "./CustomElement";

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
     */
    getLocale(): string;

    /**
     * Changes the application's locale.
     * `locale` must be one of the supported locales, see {@link getSupportedLocales()} or `undefined` (for automatic locale).
     * Note that `locale` does not need to be a precise match, e.g. `"de-DE"` is also valid if `"de"` is supported.
     *
     * > NOTE: This method will currently trigger a full restart of the application.
     * > Altering the locale on the fly is possible in theory but has not been implemented yet.
     */
    setLocale(locale: string | undefined): void;

    /**
     * Returns the locales supported by the application, i.e.
     * the locales that have associated i18n messages.
     *
     * For example: `["de", "en"]`
     */
    getSupportedLocales(): readonly string[];
}

/**
 * Implementing this interface allows a service to be notified on certain
 * application-wide lifecycle events.
 *
 * **Experimental**. This interface is not affected by semver guarantees.
 * It may change (or be removed) in a future minor release.
 */
export interface ApplicationLifecycleListener
    extends DeclaredService<"runtime.ApplicationLifecycleListener"> {
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
