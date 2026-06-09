// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger, Error } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { ApplicationContext, LocaleService } from "../api";
import { isShadowRoot, RootNode } from "../dom";
import { ErrorId } from "../errors";
import { Locale } from "../i18n";
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
        return this.#localeService.locale.tag;
    }

    /** @deprecated Use `runtime.LocaleService` instead. */
    setLocale(locale: string | undefined): void {
        const targetLocale = Locale.tryParse(locale);
        // to be backwards compatible, we check here synchronously
        // same check is done in AppIntl.setLocale
        if (targetLocale && !this.#localeService.supportsLocale(targetLocale)) {
            throw new Error(
                ErrorId.UNSUPPORTED_LOCALE,
                `Unsupported locale '${targetLocale.tag}' (supported locales: ${this.#localeService.supportedMessageLocales.map((l) => l.tag).join(", ")}).`
            );
        }
        this.#localeService.setLocale(targetLocale).catch((e) => {
            LOG.error(`Failed to switch locale to '${targetLocale?.tag}'.`, e);
        });
    }

    /** @deprecated Use `runtime.LocaleService` instead. */
    getSupportedLocales(): readonly string[] {
        return this.#localeService.supportedMessageLocales.map((l) => l.tag);
    }
}
