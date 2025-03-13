// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ApplicationContext } from "../api";
import { isShadowRoot, RootNode } from "../dom";
import { ServiceOptions } from "../Service";

export interface ApplicationContextProperties {
    host: HTMLElement;
    rootNode: RootNode;
    container: HTMLElement;
    locale: string;
    supportedLocales: string[];

    /** A callback to change the application's locale is injected by the runtime. */
    changeLocale(locale: string): void;
}

export class ApplicationContextImpl implements ApplicationContext {
    #host: HTMLElement;
    #rootNode: RootNode;
    #container: HTMLElement;
    #locale: string;
    #supportedLocales: readonly string[];
    #changeLocale: (locale: string) => void;

    constructor(_options: ServiceOptions, properties: ApplicationContextProperties) {
        this.#host = properties.host;
        this.#rootNode = properties.rootNode;
        this.#container = properties.container;
        this.#locale = properties.locale;
        this.#supportedLocales = Object.freeze(Array.from(properties.supportedLocales));
        this.#changeLocale = properties.changeLocale;
    }

    getHostElement(): HTMLElement {
        return this.#host;
    }

    getRoot(): RootNode {
        return this.#rootNode;
    }

    getShadowRoot(): ShadowRoot | undefined {
        return isShadowRoot(this.#rootNode) ? this.#rootNode : undefined;
    }

    getApplicationContainer(): HTMLElement {
        return this.#container;
    }

    getLocale(): string {
        return this.#locale;
    }

    setLocale(locale: string): void {
        // This restarts the application at the moment, so this.locale will _not_ be updated.
        // Instead, we get a new application with a new application context.
        this.#changeLocale(locale);
    }

    getSupportedLocales(): readonly string[] {
        return this.#supportedLocales;
    }
}
