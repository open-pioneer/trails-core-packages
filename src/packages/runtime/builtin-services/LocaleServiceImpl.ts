// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { type LocaleService } from "../api";
import { AppIntl } from "../i18n";

export interface LocaleServiceProperties {
    appIntl: AppIntl;
}

/**
 * Implementation of the `runtime.LocaleService` builtin service.
 */
export class LocaleServiceImpl implements LocaleService {
    // this is the truth of source.
    // Carries the real reactive state.
    #appIntl: AppIntl;

    constructor(properties: LocaleServiceProperties) {
        this.#appIntl = properties.appIntl;
    }

    get locale(): Intl.Locale {
        return this.#appIntl.locale;
    }

    get messageLocale(): Intl.Locale {
        return this.#appIntl.messageLocale;
    }

    get supportedMessageLocales(): readonly Intl.Locale[] {
        return this.#appIntl.supportedMessageLocales;
    }

    get supportsLiveChanges(): boolean {
        return this.#appIntl.supportsLiveChanges;
    }

    changeLocale(targetLocale: Intl.Locale | undefined): Promise<void> {
        return this.#appIntl.changeLocale(targetLocale);
    }

    supportsLocale(locale: Intl.Locale): boolean {
        return this.#appIntl.supportsLocale(locale);
    }
}
