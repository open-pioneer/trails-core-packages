// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger, Error, deprecated } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { ApplicationContext, LocaleService } from "../api";
import { isShadowRoot, RootNode } from "../dom";
import { ErrorId } from "../errors";
import { tryParseLocale } from "../i18n";
import { ServiceOptions } from "../Service";

const LOG = createLogger(sourceId);

export interface ApplicationContextProperties {
    host: HTMLElement;
    rootNode: RootNode;
    container: HTMLElement;
}

interface ServiceReferences {
    localeService: LocaleService;
}

export type ApplicationContextServiceOptions = ServiceOptions<ServiceReferences>;

const setLocaleDeprecationMessage = deprecated({
    name: "ApplicationContext.setLocale",
    packageName: "@open-pioneer/runtime",
    since: "v4.7.0",
    alternative: "Use `runtime.LocaleService.changeLocale` instead."
});
const getLocaleDeprecationMessage = deprecated({
    name: "ApplicationContext.getLocale",
    packageName: "@open-pioneer/runtime",
    since: "v4.7.0",
    alternative: "Use `runtime.LocaleService.locale` instead."
});
const getSupportedLocalesDeprecationMessage = deprecated({
    name: "ApplicationContext.getSupportedLocales",
    packageName: "@open-pioneer/runtime",
    since: "v4.7.0",
    alternative: "Use `runtime.LocaleService.supportedMessageLocales` instead."
});

export class ApplicationContextImpl implements ApplicationContext {
    #host: HTMLElement;
    #rootNode: RootNode;
    #container: HTMLElement;
    #localeService: LocaleService;

    constructor(
        options: ApplicationContextServiceOptions,
        properties: ApplicationContextProperties
    ) {
        this.#host = properties.host;
        this.#rootNode = properties.rootNode;
        this.#container = properties.container;
        this.#localeService = options.references.localeService;
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

    /** @deprecated Use `runtime.LocaleService` instead. */
    getLocale(): string {
        getLocaleDeprecationMessage();
        return this.#localeService.locale.baseName;
    }

    /** @deprecated Use `runtime.LocaleService` instead. */
    setLocale(locale: string | undefined): void {
        setLocaleDeprecationMessage();
        const targetLocale = tryParseLocale(locale);
        // to be backwards compatible, we check here synchronously
        // same check is done in AppIntl.changeLocale
        if (targetLocale && !this.#localeService.supportsLocale(targetLocale)) {
            throw new Error(
                ErrorId.UNSUPPORTED_LOCALE,
                `Unsupported locale '${targetLocale.baseName}' (supported locales: ${this.#localeService.supportedMessageLocales.map((l) => l.baseName).join(", ")}).`
            );
        }
        this.#localeService.changeLocale(targetLocale).catch((e) => {
            LOG.error(`Failed to switch locale to '${targetLocale?.baseName}'.`, e);
        });
    }

    /** @deprecated Use `runtime.LocaleService` instead. */
    getSupportedLocales(): readonly string[] {
        getSupportedLocalesDeprecationMessage();
        return this.#localeService.supportedMessageLocales.map((l) => l.baseName);
    }
}
