// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/**
 * Parses a BCP-47 locale tag into a {@link Intl.Locale}.
 *
 * The language, script, region, and variant subtags are preserved and
 * canonicalized. Unicode extension keys (e.g. `-u-ca-gregory`) are stripped.
 *
 * Throws a `RangeError` if the input is malformed.
 */
export function parseLocale(input: string): Readonly<Intl.Locale> {
    const intlLocale = new Intl.Locale(input);

    // Reconstruct an Intl.Locale that contains only the language-identifier
    // subtags (language + script + region + variants), dropping any Unicode
    // extension keys such as -u-ca-gregory.
    //
    // intlLocale.baseName is already the canonical language identifier without
    // extension keys, so it is exactly what we want. Re-wrapping it in a new
    // Intl.Locale gives us a clean object with no extension metadata.
    return new Intl.Locale(intlLocale.baseName);
}

/**
 * Like {@link parseLocale}, but returns `undefined` instead of throwing on malformed input.
 */
export function tryParseLocale(input: string | undefined): Readonly<Intl.Locale> | undefined {
    if (input == null) {
        return undefined;
    }
    try {
        return parseLocale(input);
    } catch {
        return undefined;
    }
}
