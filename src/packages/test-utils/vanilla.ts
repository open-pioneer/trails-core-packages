// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    createIntlCache,
    createIntl as createFormatJsIntl,
    IntlErrorCode,
    OnErrorFn
} from "@formatjs/intl";
import { PackageIntl } from "@open-pioneer/runtime";

/** Options for `createIntl`. */
export interface I18nOptions {
    /**
     * The locale for i18n messages and formatting.
     *
     * @default "en"
     */
    locale?: string;

    /**
     * The locale for embedded default messages (e.g. `defaultMessage` property in `intl.formatMessage(...)`).
     * It is usually not necessary to specify this option.
     *
     * See also https://formatjs.io/docs/intl#message-descriptor
     *
     * @default "en"
     */
    defaultMessageLocale?: string;

    /**
     * I18n messages as (messageId, message) entries.
     *
     * @default {}
     */
    messages?: Record<string, string>;
}

/**
 * Creates an `intl` instance that can be used for testing.
 *
 * Other than the default implementation provided by `@formatjs/intl`, this
 * `intl` object will not warn if a message is not defined.
 * Instead, it will simply render the fallback message.
 * This behavior makes testing easier.
 *
 * Note that messages can still be defined by using the `messages` parameter.
 */
export function createIntl(options?: I18nOptions): PackageIntl {
    const messages = options?.messages ?? {};
    const locale = options?.locale ?? "en";
    const defaultMessageLocale = options?.defaultMessageLocale ?? "en";
    const cache = createIntlCache();
    const intl = createFormatJsIntl(
        {
            locale,
            defaultLocale: defaultMessageLocale,
            messages,
            onError: INTL_ERROR_HANDLER
        },
        cache
    );
    return intl;
}

/** Hides missing translation errors during tests */
const INTL_ERROR_HANDLER: OnErrorFn = (err) => {
    if (err.code === IntlErrorCode.MISSING_TRANSLATION) {
        return;
    }

    console.error(err);
};
