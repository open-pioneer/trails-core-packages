// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger, Error } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { ErrorId } from "../errors";
import { Locale } from "./Locale";

const LOG = createLogger(sourceId);

interface LocaleMatchSuccess {
    /** The accepted locale. */
    readonly acceptedLocale: Locale;

    /** The picked supported locale */
    readonly supportedLocale: Locale;

    /** Quality of the match. */
    readonly quality: "exact" | "script" | "language";
}
interface LocaleMatchFailure {
    /** The accepted locale or undefined if no match was possible. */
    readonly acceptedLocale: undefined;

    /** The picked supported locale, or `undefined` if no match was possible. */
    readonly supportedLocale: undefined;

    /** Quality of the match. */
    readonly quality: "none";
}

/**
 * Result of {@link LocalePicker.pickBestMatch}.
 */
type LocaleMatch = LocaleMatchSuccess | LocaleMatchFailure;

/**
 * Result of {@link LocalePicker.pickSupportedLocale}.
 */
export interface LocalePickResult {
    /**
     * The actual locale (e.g. `de-DE`) used for number/date formatting.
     */
    locale: Locale;

    /**
     * The locale of the matched message bundle (e.g. `de`).
     */
    messageLocale: Locale;
}

/**
 * Picks a locale for an application based on the locales it supports
 * and the locales requested by a user.
 */
export class LocalePicker {
    #supportedLocales: readonly Locale[];

    /**
     * @param supportedLocales Locales the app has i18n messages for (e.g. `"en"`, `"de"`).
     */
    constructor(supportedLocales: ReadonlyArray<Locale>) {
        this.#supportedLocales = supportedLocales;
    }

    /**
     * Picks the locale to use during application startup.
     *
     * @param preferredLocale Optional preferred locale.
     * @param userLocales Locales requested by the user's browser.
     */
    pickSupportedLocale(
        preferredLocale: Locale | undefined,
        userLocales: ReadonlyArray<Locale>
    ): LocalePickResult {
        if (preferredLocale != null) {
            const match = this.#pickBestMatch([preferredLocale]);
            if (!match.supportedLocale) {
                const list = this.#supportedLocales.map((l) => l.tag).join(", ");
                throw new Error(
                    ErrorId.UNSUPPORTED_LOCALE,
                    `Locale '${preferredLocale.tag}' cannot be forced because it is not supported by the application.` +
                        ` Supported locales are ${list}.`
                );
            }
            if (match.quality === "language" || match.quality === "script") {
                LOG.warn(
                    `Non-exact match for forced locale '${preferredLocale.tag}': using messages from '${match.supportedLocale.tag}'.`
                );
            }
            return { locale: match.acceptedLocale, messageLocale: match.supportedLocale };
        }

        const match = this.#pickBestMatch(userLocales);
        if (match.quality !== "none") {
            return { locale: match.acceptedLocale, messageLocale: match.supportedLocale };
        }

        // Fallback: keep the most preferred user locale for formatting,
        // but pick the first app locale for messages.
        //TODO: is this really a good idea? Better simply pick "en", also for formatting?
        const fallbackUser = userLocales[0] ?? Locale.parse("en");
        const fallbackMessage = this.#supportedLocales[0] ?? Locale.parse("en");
        return { locale: fallbackUser, messageLocale: fallbackMessage };
    }

    supportsLocale(locale: Locale): boolean {
        return this.#pickBestMatch([locale]).quality !== "none";
    }

    /**
     * Picks the best supported locale for a list of accepted locales.
     *
     * Matching is performed in up to four passes per accepted locale (in order of
     * preference). The first hit wins:
     *
     * 1. **Exact tag match** – the supported locale's canonical tag equals the
     *    accepted locale's canonical tag (e.g. `zh-Hant-TW` → `zh-Hant-TW`).
     *    A de-simple variant, will only match with exact tag.
     *
     * 2. **Language + script match** – only considered when the accepted locale
     *    carries a script subtag. The supported locale must match on both
     *    `language` and `script` and must have no region (e.g. `zh-Hant-TW` →
     *    `zh-Hant`). Supported locales that carry variant subtags are excluded
     *    from this pass.
     *
     * 3. **Language match** – only considered when the accepted locale has
     *    **no** script subtag. The supported locale must be language-only (no
     *    script, region, or variants) and share the same language subtag
     *    (e.g. `de-DE` → `de`).
     *
     * 4. **None** – no match found.
     *
     * @param accepted Locales requested by the caller, in order of preference.
     * @param supported Locales to choose from. Defaults to the app's supported message locales.
     */
    #pickBestMatch(
        accepted: ReadonlyArray<Locale>,
        supported: ReadonlyArray<Locale> = this.#supportedLocales
    ): LocaleMatch {
        for (const acceptedLoc of accepted) {
            // Pass 1: exact tag match.
            const exact = supported.find((s) => s.tag === acceptedLoc.tag);
            if (exact) {
                return { acceptedLocale: acceptedLoc, supportedLocale: exact, quality: "exact" };
            }

            if (acceptedLoc.script) {
                // Pass 2: language + script match (region dropped on both sides).
                // Supported locale must share language+script, have no region, and
                // carry no variant subtags (variants are only matched exactly).
                const scriptMatch = supported.find(
                    (s) =>
                        s.language === acceptedLoc.language &&
                        s.script === acceptedLoc.script &&
                        !s.region &&
                        s.variants.length === 0
                );
                if (scriptMatch) {
                    return {
                        acceptedLocale: acceptedLoc,
                        supportedLocale: scriptMatch,
                        quality: "script"
                    };
                }
                continue; // skip language-only pass for locales with script
            }

            // Pass 3: language-only match (no script on accepted locale).
            // The supported locale must be fully language-only (no script, region, or variants).
            const langMatch = supported.find(
                (s) => s.isLanguageOnly && s.language === acceptedLoc.language
            );
            if (langMatch) {
                return {
                    acceptedLocale: acceptedLoc,
                    supportedLocale: langMatch,
                    quality: "language"
                };
            }
        }
        return { acceptedLocale: undefined, supportedLocale: undefined, quality: "none" };
    }
}

/**
 * Returns the locales currently preferred by the user's browser, in order of preference.
 *
 * See also https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages
 *
 * Invalid entries (which should not occur in practice) are silently dropped.
 */
export function getBrowserLocales(): readonly Locale[] {
    if (typeof window === "undefined") {
        return [];
    }
    const tags =
        window.navigator.languages && window.navigator.languages.length
            ? Array.from(window.navigator.languages)
            : [window.navigator.language];
    const result: Locale[] = [];
    for (const tag of tags) {
        const locale = Locale.tryParse(tag);
        if (locale) {
            result.push(locale);
        }
    }
    return result;
}
