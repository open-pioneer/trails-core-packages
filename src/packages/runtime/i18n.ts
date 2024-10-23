// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createIntl, createIntlCache, IntlFormatters, IntlShape } from "@formatjs/intl";
import { ErrorId } from "./errors";
import { createLogger, Error } from "@open-pioneer/core";
import { ApplicationMetadata } from "./metadata";
const LOG = createLogger("runtime:i18n");

/**
 * Represents i18n info for the entire application.
 * Currently not exposed to user code.
 */
export interface AppI18n {
    /** Chosen locale */
    readonly locale: string;

    /** Supported locales from app metadata. */
    readonly supportedMessageLocales: string[];

    /** True if the locale can be used in this application (i.e. if there are any messages). */
    supportsLocale(locale: string): boolean;

    /** Given the package name, constructs a package i18n instance. */
    createPackageI18n(packageName: string): PackageIntl;
}

/**
 * Gives access to the package's i18n messages for the current locale.
 *
 * See also https://formatjs.io/docs/intl
 */
export type PackageIntl = Pick<IntlShape, "locale" | "timeZone"> & IntlFormatters<string>;

export function createPackageIntl(locale: string, messages: Record<string, string>) {
    const cache = createIntlCache();
    return createIntl(
        {
            locale,
            messages
        },
        cache
    );
}

/**
 * Initializes the application's locale and fetches the appropriate i18n messages.
 */
export async function initI18n(
    appMetadata: ApplicationMetadata | undefined,
    forcedLocale: string | undefined
): Promise<AppI18n> {
    const messageLocales = appMetadata?.locales ?? [];
    const userLocales = getBrowserLocales();
    if (LOG.isDebug()) {
        LOG.debug(
            `Attempting to pick locale for user (locales: ${userLocales.join(
                ", "
            )}) from app (supported locales: ${messageLocales.join(
                ", "
            )}) [forcedLocale=${forcedLocale}].`
        );
    }

    const i18nConfig = new I18nConfig(messageLocales);
    const { locale, messageLocale } = i18nConfig.pickSupportedLocale(forcedLocale, userLocales);

    if (LOG.isDebug()) {
        LOG.debug(`Using locale '${locale}' with messages from locale '${messageLocale}'.`);
    }

    let messages: Record<string, Record<string, string>>;
    if (messageLocales.includes(messageLocale)) {
        try {
            messages = (await appMetadata?.loadMessages?.(messageLocale)) ?? {};
        } catch (e) {
            throw new Error(
                ErrorId.INTERNAL,
                `Failed to load messages for locale '${messageLocale}'.`,
                {
                    cause: e
                }
            );
        }
    }
    return {
        locale,
        supportedMessageLocales: messageLocales,
        supportsLocale(locale) {
            return i18nConfig.supportsLocale(locale);
        },
        createPackageI18n(packageName) {
            const packageMessage = messages?.[packageName] ?? {};
            return createPackageIntl(locale, packageMessage);
        }
    };
}

/** Creates an empty i18n instance, e.g. for tests. */
export function createEmptyI18n(locale = "en"): PackageIntl {
    return createPackageIntl(locale, {});
}

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
 * Picks a locale for the app. Exported for tests.
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
