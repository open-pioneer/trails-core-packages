// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Error } from "@open-pioneer/core";
import { match as bestFitMatch } from "@formatjs/intl-localematcher";
import { ErrorId } from "../errors";
import { parseLocale, tryParseLocale } from "./intl-locale";

const NO_MATCH_SENTINEL = "qaa-x-no-match";

const LOCALE_FIELDS = ["language", "script", "region"] as const;

/**
 * Result of {@link LocalePicker.pickSupportedLocale}.
 */
export interface LocalePickResult {
    /**
     * The actual locale (e.g. `de-DE`) used for number/date formatting.
     */
    locale: Readonly<Intl.Locale>;

    /**
     * The locale of the matched message bundle (e.g. `de`).
     */
    messageLocale: Readonly<Intl.Locale>;
}

/**
 * Picks a locale for an application based on the locales it supports
 * and the locales requested by a user.
 */
export class LocalePicker {
    #supportedLocales: readonly Readonly<Intl.Locale>[];
    #supportedTags: readonly string[];

    /**
     * @param supportedLocales Locales the app has i18n messages for (e.g. `"en"`, `"de"`, `"de-CH"`).
     *   May be empty; in that case the picker behaves as if a single `"en"`
     *   supported locale were configured.
     */
    constructor(supportedLocales: ReadonlyArray<Readonly<Intl.Locale>>) {
        this.#supportedLocales =
            supportedLocales.length > 0 ? supportedLocales : [parseLocale("en")];
        this.#supportedTags = this.#supportedLocales.map((l) => l.baseName);
    }

    /**
     * Picks the locale to use during application startup or for a runtime locale switch.
     *
     * @param preferredLocale Optional preferred (forced) locale.
     * @param userLocales Locales requested by the user's browser, in priority order.
     */
    pickSupportedLocale(
        preferredLocale: Readonly<Intl.Locale> | undefined,
        userLocales: ReadonlyArray<Readonly<Intl.Locale>>
    ): LocalePickResult {
        const messageLocale = this.#pickMessageLocale(preferredLocale, userLocales);
        const base = preferredLocale ?? messageLocale;
        const locale = this.#pickFormattingLocale(base, userLocales);
        return { locale, messageLocale };
    }

    /**
     * Returns `true` if the given locale is accepted by
     * {@link pickSupportedLocale}.
     */
    supportsLocale(locale: Readonly<Intl.Locale>): boolean {
        return bestFit([locale.baseName], this.#supportedTags) !== NO_MATCH_SENTINEL;
    }

    #pickMessageLocale(
        preferred: Readonly<Intl.Locale> | undefined,
        browserLocales: ReadonlyArray<Readonly<Intl.Locale>>
    ): Readonly<Intl.Locale> {
        const candidates = preferred ? [preferred] : browserLocales;
        // #supportedLocales is guaranteed non-empty (see constructor).
        const firstSupported = this.#supportedLocales[0] as Readonly<Intl.Locale>;
        if (candidates.length === 0) {
            return firstSupported;
        }

        const match = bestFit(
            candidates.map((l) => l.baseName),
            this.#supportedTags
        );
        if (match !== NO_MATCH_SENTINEL) {
            return parseLocale(match);
        }
        if (preferred) {
            throw new Error(
                ErrorId.UNSUPPORTED_LOCALE,
                `Unsupported locale '${preferred.baseName}' (supported locales: ${this.#supportedTags.join(", ")}).`
            );
        }
        return firstSupported;
    }

    #pickFormattingLocale(
        base: Readonly<Intl.Locale>,
        userLocales: ReadonlyArray<Readonly<Intl.Locale>>
    ): Readonly<Intl.Locale> {
        let candidate = base;
        let bestScore = equalityScore(candidate, base);
        // try to find a more specific locale from the user's browser locales
        for (const userLocale of userLocales) {
            const score = equalityScore(userLocale, base);
            if (score > bestScore) {
                candidate = userLocale;
                bestScore = score;
            }
        }
        return candidate;
    }
}

// Higher score means the candidate shares more fields with the base locale
// without contradicting any field defined on the base.
function equalityScore(candidate: Readonly<Intl.Locale>, base: Readonly<Intl.Locale>): number {
    let score = 0;
    for (const field of LOCALE_FIELDS) {
        const b = base[field];
        const c = candidate[field];
        if (b && c !== b) return 0;
        if (c) score++;
    }
    return score;
}

/**
 * Runs the CLDR best-fit matcher and returns either a supported tag or
 * {@link NO_MATCH_SENTINEL} when no real match exists.
 */
function bestFit(tags: readonly string[], supportedTags: readonly string[]): string {
    return bestFitMatch(tags, supportedTags, NO_MATCH_SENTINEL, {
        algorithm: "best fit"
    });
}

/**
 * Returns the locales currently preferred by the user's browser, in order of preference.
 *
 * See also https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages
 *
 * Invalid entries (which should not occur in practice) are silently dropped.
 */
export function getBrowserLocales(): readonly Readonly<Intl.Locale>[] {
    if (typeof window === "undefined") {
        return [];
    }
    const tags = window.navigator.languages?.length
        ? window.navigator.languages
        : [window.navigator.language];
    return tags.map(tryParseLocale).filter((l): l is Readonly<Intl.Locale> => l != null);
}
