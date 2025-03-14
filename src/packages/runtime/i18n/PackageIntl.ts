// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createIntl, createIntlCache, IntlFormatters, IntlShape } from "@formatjs/intl";

/**
 * Gives access to the package's i18n messages for the current locale.
 *
 * See also https://formatjs.io/docs/intl
 */
export type PackageIntl = Pick<IntlShape, "locale" | "timeZone"> & IntlFormatters<string>;

/**
 * Creates a package intl instance with the given locale and messages.
 */
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

/** Creates an empty i18n instance, e.g. for tests. */
export function createEmptyPackageIntl(locale = "en"): PackageIntl {
    return createPackageIntl(locale, {});
}
