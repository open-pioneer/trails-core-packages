// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0

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
    getApiMethods(): Promise<ApiMethods>;
}

/**
 * A service provided by the system.
 * Used by the runtime to assemble the public facing API.
 */
export interface ApiService {
    /**
     * Called by the runtime to gather methods that should be available from the web component's API.
     */
    getApi(): Promise<ApiMethods>;
}

/**
 * A service provided by the system, useful for accessing values that are global to the application.
 */
export interface ApplicationContext {
    /**
     * The web component's host element.
     * This dom node can be accessed by the host site.
     */
    getHostElement(): HTMLElement;

    /**
     * The current web component's shadow root.
     */
    getShadowRoot(): ShadowRoot;

    /**
     * The node containing the rest of the application _inside_ the current web component's shadow dom.
     */
    getApplicationContainer(): HTMLElement;

    /**
     * Returns the current locale of the application.
     *
     * E.g. `"de-DE"`
     */
    getLocale(): string;

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
export interface ApplicationLifecycleListener {
    /**
     * Called after all services required by the application have been started.
     */
    afterApplicationStart?(): void;

    /**
     * Called during the application shutdown just before services will be destroyed.
     */
    beforeApplicationStop?(): void;
}

declare module "./ServiceRegistry" {
    interface ServiceRegistry {
        "runtime.ApiService": ApiService;
        "runtime.ApplicationContext": ApplicationContext;
        "runtime.ApplicationLifecycleListener": ApplicationLifecycleListener;
    }
}