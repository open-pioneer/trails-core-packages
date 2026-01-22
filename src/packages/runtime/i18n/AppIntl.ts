// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger, Error } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { ErrorId } from "../errors";
import { ApplicationMetadata } from "../metadata";
import { createPackageIntl, PackageIntl } from "./PackageIntl";
import { getBrowserLocales, I18nConfig } from "./pick";
const LOG = createLogger(sourceId);

/**
 * Represents i18n info for the entire application.
 * Currently not exposed to user code.
 */
export interface AppIntl {
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
 * Initializes the application's locale and fetches the appropriate i18n messages.
 */
export async function initI18n(
    appMetadata: ApplicationMetadata | undefined,
    forcedLocale: string | undefined
): Promise<AppIntl> {
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
