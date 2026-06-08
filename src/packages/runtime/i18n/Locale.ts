// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

const CACHE_TAG_TO_LOCALE = new Map<string, Locale>();

/**
 * Immutable value object representing a BCP-47 locale tag.
 *
 * Wraps the native [Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
 * so that the language, script, region, and variant subtags become explicit instead
 * of being encoded inside an opaque string.
 *
 * The following BCP-47 subtags are preserved:
 * - **language** – primary language subtag (e.g. `"de"`, `"zh"`)
 * - **script** – writing-system subtag (e.g. `"Hant"`, `"Latn"`); present only when
 *   the language is written in multiple scripts (e.g. `zh-Hans` vs `zh-Hant`,
 *   `sr-Cyrl` vs `sr-Latn`)
 * - **region** – country/region subtag (e.g. `"DE"`, `"TW"`)
 * - **variants** – dialect/orthography subtags (e.g. `["1996"]`, `["simple"]`)
 *
 * Unicode extension keys (e.g. `-u-ca-gregory`) are **not** preserved.
 *
 * Use {@link Locale.parse} or {@link Locale.tryParse} to construct instances.
 */
export class Locale {
    #intl: Intl.Locale;
    #variants: readonly string[];

    private constructor(intlLocale: Intl.Locale, variants: readonly string[]) {
        this.#intl = intlLocale;
        this.#variants = variants;
    }

    /**
     * Parses a BCP-47 locale tag.
     *
     * The language, script, region, and variant subtags are preserved and
     * canonicalized. Unicode extension keys are stripped.
     *
     * Throws a `RangeError` if the input is malformed.
     */
    static parse(input: string): Locale {
        const cached = CACHE_TAG_TO_LOCALE.get(input);
        if (cached) {
            return cached;
        }
        const normalized = Locale.#normalizeTag(input);
        const intlLocale = new Intl.Locale(normalized);

        // Read variant subtags in a way that works on all engines.
        const rawVariants = Locale.#extractVariants(intlLocale);

        // Reconstruct an Intl.Locale that contains only the language-identifier
        // subtags (language + script + region + variants), dropping any Unicode
        // extension keys such as -u-ca-gregory.
        //
        // intlLocale.baseName is already the canonical language identifier without
        // extension keys, so it is exactly what we want. Re-wrapping it in a new
        // Intl.Locale gives us a clean object with no extension metadata.
        const reducedIntl = new Intl.Locale(intlLocale.baseName);

        const locale = new Locale(reducedIntl, rawVariants);
        const cachedReduced = CACHE_TAG_TO_LOCALE.get(locale.tag);
        if (cachedReduced) {
            // Return the already-cached canonical instance and also cache the
            // original input so the next lookup is O(1).
            CACHE_TAG_TO_LOCALE.set(input, cachedReduced);
            return cachedReduced;
        }
        CACHE_TAG_TO_LOCALE.set(input, locale);
        CACHE_TAG_TO_LOCALE.set(locale.tag, locale);
        return locale;
    }

    /**
     * Like {@link parse}, but returns `undefined` instead of throwing on malformed input.
     */
    static tryParse(input: string | undefined): Locale | undefined {
        if (input == null) {
            return undefined;
        }
        try {
            return Locale.parse(input);
        } catch {
            return undefined;
        }
    }

    /**
     * The canonical BCP-47 tag string, including language, script, region, and
     * any variant subtags (e.g. `"de-simple"`, `"zh-Hant-TW"`).
     */
    get tag(): string {
        return this.#intl.baseName;
    }

    /**
     * The primary language subtag (e.g. `"de"`, `"zh"`).
     */
    get language(): string {
        return this.#intl.language;
    }

    /**
     * The script subtag (ISO 15924, title-case), or `undefined` when the script
     * is not explicitly specified (e.g. `"Hant"` in `zh-Hant`, `"Latn"` in `sr-Latn`).
     */
    get script(): string | undefined {
        return this.#intl.script;
    }

    /**
     * The region subtag (ISO 3166-1 alpha-2 or UN M.49 numeric), or `undefined`
     * when no region is specified (e.g. `"DE"` in `de-DE`, `"TW"` in `zh-Hant-TW`).
     */
    get region(): string | undefined {
        return this.#intl.region;
    }

    /**
     * The variant subtags in the order they appear in the tag, or an empty array
     * when there are none (e.g. `["simple"]` for `de-simple`, `["1996"]` for `de-1996`).
     *
     * Variant subtags are parsed reliably on all engines: the native
     * `Intl.Locale.prototype.variants` (ES2027, Chrome 130+, Node 22+) is used when
     * available; on older engines the subtags are extracted directly from
     * `Intl.Locale.baseName`, which has been universally supported since ES2020.
     */
    get variants(): readonly string[] {
        return this.#variants;
    }

    /**
     * Returns `true` if this locale consists of only a language subtag,
     * i.e. it has no script, region, or variant subtags.
     */
    get isLanguageOnly(): boolean {
        return !this.script && !this.region && this.#variants.length === 0;
    }

    /**
     * Returns `true` if both locales have identical canonicalized tags.
     */
    equals(other: Locale | undefined): boolean {
        if (!other) {
            return false;
        }
        return this.tag === other.tag;
    }

    /**
     * Returns a {@link Locale} that contains only the language subtag of this locale
     * (script, region, and variants are all dropped).
     * Returns this instance if it already is language-only.
     */
    toLanguageOnly(): Locale {
        if (this.isLanguageOnly) {
            return this;
        }
        return Locale.parse(this.language);
    }

    /**
     * Returns the underlying native `Intl.Locale` object for advanced use cases.
     */
    toIntlLocale(): Intl.Locale {
        return this.#intl;
    }

    /**
     * Returns the canonical BCP-47 tag (same as {@link tag}).
     */
    toString(): string {
        return this.tag;
    }

    /**
     * Returns the canonical BCP-47 tag for serialization.
     */
    toJSON(): string {
        return this.tag;
    }

    /**
     * Normalizes locale-like strings before they are passed to `Intl.Locale`.
     *
     * - Replaces underscores with hyphens (`zh_CN` -> `zh-CN`).
     * - Trims surrounding whitespace.
     */
    static #normalizeTag(tag: string): string {
        return tag.trim().replace(/_/g, "-");
    }

    /**
     * Returns the variant subtags for an `Intl.Locale` instance.
     *
     * Prefers the native `Intl.Locale.prototype.variants` property (ES2027,
     * Chrome 130+, Node 22+) and falls back to {@link parseVariantsFromBaseName}
     * on older engines so the result is consistent across all environments.
     */
    static #extractVariants(intlLocale: Intl.Locale): readonly string[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const native = (intlLocale as any).variants;
        if (Array.isArray(native)) {
            return native as readonly string[];
        }
        return parseVariantsFromBaseName(intlLocale.baseName);
    }
}

/**
 * Extracts variant subtags from an `Intl.Locale` baseName string.
 *
 * BCP-47 baseName format: `language[-script][-region][-variant...]`
 *
 * - language: 2–8 ASCII letters (always the first subtag)
 * - script:   exactly 4 ASCII letters (title-case, e.g. "Hant") – optional
 * - region:   2 ASCII letters or 3 digits – optional
 * - variants: 5–8 alphanumeric chars, or exactly 4 chars starting with a digit
 *
 * This parser is used as a reliable fallback on engines that do not yet
 * implement `Intl.Locale.prototype.variants` (standardized in ES2027).
 * Because `baseName` has been available since ES2020, parsing from it works
 * uniformly across all conformant engines.
 */
function parseVariantsFromBaseName(baseName: string): readonly string[] {
    const parts = baseName.split("-");
    let idx = 1; // skip language (always first subtag)

    // Skip optional script: exactly 4 ASCII letters (e.g. "Hant", "Latn")
    const maybScript = parts[idx];
    if (maybScript !== undefined && /^[A-Za-z]{4}$/.test(maybScript)) {
        idx++;
    }

    // Skip optional region: 2 ASCII letters (e.g. "DE") or 3 digits (e.g. "419")
    const maybeRegion = parts[idx];
    if (maybeRegion !== undefined && /^(?:[A-Za-z]{2}|[0-9]{3})$/.test(maybeRegion)) {
        idx++;
    }

    // Collect remaining subtags that match the BCP-47 variant production:
    //   - 5–8 alphanumeric characters, OR
    //   - exactly 4 characters where the first is a digit (e.g. "1996", "1901")
    const variants: string[] = [];
    for (; idx < parts.length; idx++) {
        const sub = parts[idx];
        if (
            sub !== undefined &&
            (/^[A-Za-z0-9]{5,8}$/.test(sub) || /^[0-9][A-Za-z0-9]{3}$/.test(sub))
        ) {
            variants.push(sub);
        }
    }
    return variants;
}
