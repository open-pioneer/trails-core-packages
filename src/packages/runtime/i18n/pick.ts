// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger, Error } from "@open-pioneer/core";
import { ErrorId } from "../errors";
const LOG = createLogger("runtime:i18n");

export interface LocalePickResult {
    /**
     * The actual locale (e.g. en-US) for number and date formatting etc.
     */
    locale: string;

    /**
     * The locale identifier to load messages for. E.g. "en".
     */
    messageLocale: string;
}

/**
 * Picks a locale for the app.
 */
export class I18nConfig {
    private appLocales: string[];

    /**
     * @param appLocales Locales the app has i18n messages for (e.g. "en", "de")
     */
    constructor(appLocales: string[]) {
        this.appLocales = appLocales;
    }

    /**
     * @param forcedLocale Optional forced locale (must be satisfied)
     * @param userLocales Locales requested by the user's browser
     */
    pickSupportedLocale(forcedLocale: string | undefined, userLocales: string[]): LocalePickResult {
        const { appLocales } = this;
        // Attempt to satisfy forced locale
        if (forcedLocale) {
            const result = this.pickImpl([forcedLocale]);
            if (!result) {
                const localesList = appLocales.join(", ");
                throw new Error(
                    ErrorId.UNSUPPORTED_LOCALE,
                    `Locale '${forcedLocale}' cannot be forced because it is not supported by the application.` +
                        ` Supported locales are ${localesList}.`
                );
            }
            if (result.locale !== result.messageLocale) {
                LOG.warn(
                    `Non-exact match for forced locale '${forcedLocale}': using messages from '${result.messageLocale}'.`
                );
            }
            return result;
        }

        // Match preferred locale
        const supportedLocale = this.pickImpl(userLocales);
        if (supportedLocale) {
            return supportedLocale;
        }

        // Fallback: Most preferred locale (for dates etc.), but some of our messages
        return {
            locale: userLocales[0] ?? "en",
            messageLocale: appLocales[0] ?? "en"
        };
    }

    supportsLocale(locale: string): boolean {
        return this.pickImpl([locale]) != null;
    }

    private pickImpl(requestedLocales: string[]) {
        const appLocales = this.appLocales;
        for (const requestedLocale of requestedLocales) {
            // try exact match
            if (appLocales.includes(requestedLocale)) {
                return { messageLocale: requestedLocale, locale: requestedLocale };
            }

            // try plain language tag (e.g. "en") as fallback
            const plainLanguage = requestedLocale.match(/^([a-z]+)/i)?.[1];
            if (plainLanguage && appLocales.includes(plainLanguage)) {
                return { messageLocale: plainLanguage, locale: requestedLocale };
            }
        }
        return undefined;
    }
}

/**
 * Returns locales supported by the browser, in order of preference (preferred first).
 *
 * See also https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages
 */
export function getBrowserLocales(): string[] {
    if (window.navigator.languages && window.navigator.languages.length) {
        return Array.from(window.navigator.languages);
    }
    return [window.navigator.language];
}
