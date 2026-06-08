// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { Locale } from "./Locale";

it("parses a plain language tag", () => {
    const loc = Locale.parse("de");
    expect(loc.tag).toBe("de");
    expect(loc.language).toBe("de");
    expect(loc.region).toBeUndefined();
});

it("parses a language and region tag", () => {
    const loc = Locale.parse("de-DE");
    expect(loc.tag).toBe("de-DE");
    expect(loc.language).toBe("de");
    expect(loc.region).toBe("DE");
});

it("preserves script subtag alongside language and region", () => {
    const loc = Locale.parse("zh-Hant-TW");
    expect(loc.language).toBe("zh");
    expect(loc.script).toBe("Hant");
    expect(loc.region).toBe("TW");
    expect(loc.tag).toBe("zh-Hant-TW");
});

it("normalizes underscores to hyphens", () => {
    const loc = Locale.parse("zh_CN");
    expect(loc.tag).toBe("zh-CN");
    expect(loc.language).toBe("zh");
    expect(loc.region).toBe("CN");
});

it("trims surrounding whitespace", () => {
    const loc = Locale.parse("  de-DE  ");
    expect(loc.tag).toBe("de-DE");
});

it("returns the same instance for repeated parse calls (cache)", () => {
    expect(Locale.parse("de-DE")).toBe(Locale.parse("de-DE"));
    expect(Locale.parse("de")).toBe(Locale.parse("de"));
});

it("returns the same cached instance for different spellings of the same tag", () => {
    // underscore vs hyphen both resolve to the same Locale instance
    expect(Locale.parse("zh_CN")).toBe(Locale.parse("zh-CN"));
});

it("throws on malformed input via parse", () => {
    expect(() => Locale.parse("@@@")).toThrow();
});

it("returns undefined on malformed input via tryParse", () => {
    expect(Locale.tryParse("@@@")).toBeUndefined();
    expect(Locale.tryParse(undefined)).toBeUndefined();
});

it("compares two locales for equality", () => {
    const loc = Locale.parse("de-DE");
    expect(loc.equals(loc)).toBe(true);
    expect(Locale.parse("de-DE").equals(Locale.parse("de-DE"))).toBe(true);
    expect(Locale.parse("de-DE").equals(Locale.parse("de"))).toBe(false);
    expect(Locale.parse("de").equals(Locale.parse("en"))).toBe(false);
    expect(Locale.parse("de").equals(undefined)).toBe(false);
});

it("returns a language-only locale via toLanguageOnly", () => {
    const langOnly = Locale.parse("de-DE").toLanguageOnly();
    expect(langOnly.tag).toBe("de");
    expect(langOnly.region).toBeUndefined();
});

it("returns the same instance when toLanguageOnly is a no-op", () => {
    const loc = Locale.parse("de");
    expect(loc.toLanguageOnly()).toBe(loc);
});

it("toLanguageOnly returns the same cached instance as parsing the language directly", () => {
    expect(Locale.parse("de-DE").toLanguageOnly()).toBe(Locale.parse("de"));
});

it("detects language-only locales via isLanguageOnly", () => {
    expect(Locale.parse("de").isLanguageOnly).toBe(true);
    expect(Locale.parse("de-DE").isLanguageOnly).toBe(false);
});

it("serializes to its tag via toString and toJSON", () => {
    const loc = Locale.parse("de-DE");
    expect(loc.toString()).toBe("de-DE");
    expect(loc.toJSON()).toBe("de-DE");
    expect(JSON.stringify({ loc })).toBe('{"loc":"de-DE"}');
});

it("exposes the underlying Intl.Locale", () => {
    const loc = Locale.parse("de-DE");
    expect(loc.toIntlLocale()).toBeInstanceOf(Intl.Locale);
    expect(loc.toIntlLocale().baseName).toBe("de-DE");
});

it("parses a language+script tag without region", () => {
    const loc = Locale.parse("zh-Hans");
    expect(loc.language).toBe("zh");
    expect(loc.script).toBe("Hans");
    expect(loc.region).toBeUndefined();
    expect(loc.tag).toBe("zh-Hans");
});

it("parses a language+script+region tag", () => {
    const loc = Locale.parse("sr-Latn-RS");
    expect(loc.language).toBe("sr");
    expect(loc.script).toBe("Latn");
    expect(loc.region).toBe("RS");
    expect(loc.tag).toBe("sr-Latn-RS");
});

it("has undefined script for a plain language tag", () => {
    expect(Locale.parse("de").script).toBeUndefined();
    expect(Locale.parse("de-DE").script).toBeUndefined();
});

it("isLanguageOnly returns false when script is set", () => {
    expect(Locale.parse("zh-Hans").isLanguageOnly).toBe(false);
    expect(Locale.parse("zh-Hant-TW").isLanguageOnly).toBe(false);
    expect(Locale.parse("sr-Latn").isLanguageOnly).toBe(false);
});

it("toLanguageOnly drops script and region", () => {
    const loc = Locale.parse("zh-Hant-TW").toLanguageOnly();
    expect(loc.tag).toBe("zh");
    expect(loc.script).toBeUndefined();
    expect(loc.region).toBeUndefined();
});

it("toLanguageOnly is a no-op for a language-only locale", () => {
    const loc = Locale.parse("zh");
    expect(loc.toLanguageOnly()).toBe(loc);
});

it("toLanguageOnly returns the same cached instance as parsing the language directly (script case)", () => {
    expect(Locale.parse("zh-Hant-TW").toLanguageOnly()).toBe(Locale.parse("zh"));
});

it("strips Unicode extension keys, keeping language/script/region", () => {
    const loc = Locale.parse("zh-Hant-TW-u-ca-gregory");
    expect(loc.language).toBe("zh");
    expect(loc.script).toBe("Hant");
    expect(loc.region).toBe("TW");
    // Extension keys must not appear in the canonical tag.
    expect(loc.tag).toBe("zh-Hant-TW");
});

it("exposes variant subtags", () => {
    // de-simple: "simple" is a variant subtag (6 chars, letter-initial)
    const loc = Locale.parse("de-simple");
    expect(loc.tag).toBe("de-simple");
    expect(Array.isArray(loc.variants)).toBe(true);
    expect(loc.variants).toEqual(["simple"]);
});

it("isLanguageOnly returns false for a locale with variants", () => {
    expect(Locale.parse("de-simple").isLanguageOnly).toBe(false);
});

it("toLanguageOnly drops variants", () => {
    const loc = Locale.parse("de-simple").toLanguageOnly();
    expect(loc.tag).toBe("de");
    expect(loc.variants).toEqual([]);
});

// --- Additional variant subtag tests ---

it("parses a numeric variant subtag (4 chars, digit-initial)", () => {
    // "1996" is the orthography reform variant for German
    const loc = Locale.parse("de-1996");
    expect(loc.language).toBe("de");
    expect(loc.variants).toEqual(["1996"]);
    expect(loc.tag).toBe("de-1996");
    expect(loc.isLanguageOnly).toBe(false);
});

it("parses multiple variant subtags", () => {
    // Artificial but valid BCP-47: two variant subtags.
    // Intl.Locale canonicalizes variant order alphabetically (BCP-47 canonical form).
    const loc = Locale.parse("sl-rozaj-biske");
    expect(loc.language).toBe("sl");
    expect(loc.variants).toEqual(["biske", "rozaj"]); // canonical sorted order
    expect(loc.tag).toBe("sl-biske-rozaj");           // baseName reflects sorted tag
    expect(loc.isLanguageOnly).toBe(false);
});

it("parses variant subtag alongside region", () => {
    // language + region + variant
    const loc = Locale.parse("de-AT-1996");
    expect(loc.language).toBe("de");
    expect(loc.region).toBe("AT");
    expect(loc.script).toBeUndefined();
    expect(loc.variants).toEqual(["1996"]);
    expect(loc.tag).toBe("de-AT-1996");
    expect(loc.isLanguageOnly).toBe(false);
});

it("parses variant subtag alongside script and region", () => {
    // language + script + region + variant
    const loc = Locale.parse("sr-Cyrl-RS-ekavsk");
    expect(loc.language).toBe("sr");
    expect(loc.script).toBe("Cyrl");
    expect(loc.region).toBe("RS");
    expect(loc.variants).toEqual(["ekavsk"]);
    expect(loc.tag).toBe("sr-Cyrl-RS-ekavsk");
    expect(loc.isLanguageOnly).toBe(false);
});

it("parses variant subtag alongside script without region", () => {
    const loc = Locale.parse("sr-Latn-ekavsk");
    expect(loc.language).toBe("sr");
    expect(loc.script).toBe("Latn");
    expect(loc.region).toBeUndefined();
    expect(loc.variants).toEqual(["ekavsk"]);
    expect(loc.tag).toBe("sr-Latn-ekavsk");
});

it("empty array for a tag with no variants", () => {
    expect(Locale.parse("de").variants).toEqual([]);
    expect(Locale.parse("de-DE").variants).toEqual([]);
    expect(Locale.parse("zh-Hant-TW").variants).toEqual([]);
});

it("toLanguageOnly drops variant + region", () => {
    const loc = Locale.parse("de-AT-1996").toLanguageOnly();
    expect(loc.tag).toBe("de");
    expect(loc.region).toBeUndefined();
    expect(loc.variants).toEqual([]);
});

it("toLanguageOnly drops variant + script + region", () => {
    const loc = Locale.parse("sr-Cyrl-RS-ekavsk").toLanguageOnly();
    expect(loc.tag).toBe("sr");
    expect(loc.script).toBeUndefined();
    expect(loc.region).toBeUndefined();
    expect(loc.variants).toEqual([]);
});

it("two locales with different variants are not equal", () => {
    expect(Locale.parse("de-1996").equals(Locale.parse("de-simple"))).toBe(false);
    expect(Locale.parse("de-1996").equals(Locale.parse("de"))).toBe(false);
    expect(Locale.parse("de-1996").equals(Locale.parse("de-1996"))).toBe(true);
});

it("caches variant locales correctly", () => {
    expect(Locale.parse("de-1996")).toBe(Locale.parse("de-1996"));
    expect(Locale.parse("sl-rozaj-biske")).toBe(Locale.parse("sl-rozaj-biske"));
});

it("strips Unicode extension keys while preserving variants", () => {
    const loc = Locale.parse("de-1996-u-ca-gregory");
    expect(loc.language).toBe("de");
    expect(loc.variants).toEqual(["1996"]);
    expect(loc.tag).not.toContain("-u-");
    expect(loc.tag).toBe("de-1996");
});

it("serializes a variant locale correctly via toString and toJSON", () => {
    const loc = Locale.parse("de-1996");
    expect(loc.toString()).toBe("de-1996");
    expect(loc.toJSON()).toBe("de-1996");
    expect(JSON.stringify({ loc })).toBe('{"loc":"de-1996"}');
});
