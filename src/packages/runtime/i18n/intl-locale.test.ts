// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { parseLocale, tryParseLocale } from "./intl-locale";

it("parseLocale returns an Intl.Locale instance", () => {
    expect(parseLocale("en")).toBeInstanceOf(Intl.Locale);
});

it("parseLocale preserves language / region / script / variants", () => {
    const locale = parseLocale("zh-Hant-TW");
    expect(locale.language).toBe("zh");
    expect(locale.script).toBe("Hant");
    expect(locale.region).toBe("TW");
    expect(locale.baseName).toBe("zh-Hant-TW");
});

it("parseLocale preserves variant subtags", () => {
    const locale = parseLocale("de-1996");
    expect(locale.baseName).toBe("de-1996");
});

it("parseLocale strips Unicode extension keys", () => {
    const locale = parseLocale("de-DE-u-ca-gregory");
    expect(locale.baseName).toBe("de-DE");
});

it("parseLocale throws RangeError on malformed input", () => {
    expect(() => parseLocale("@@@")).toThrow(RangeError);
});

it("tryParseLocale returns a Locale for valid input", () => {
    const locale = tryParseLocale("en-US");
    expect(locale).toBeInstanceOf(Intl.Locale);
    expect(locale?.baseName).toBe("en-US");
});

it("tryParseLocale returns undefined for undefined input", () => {
    expect(tryParseLocale(undefined)).toBeUndefined();
});

it("tryParseLocale returns undefined for malformed input", () => {
    expect(tryParseLocale("@@@")).toBeUndefined();
});
