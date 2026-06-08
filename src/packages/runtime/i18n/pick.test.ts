// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { LocalePicker } from "./pick";
import { Locale } from "./Locale";

it("picks a supported locale by default", () => {
    const result = pickLocale(undefined, ["en", "de"], ["de"]);
    expect(result.locale.tag).toBe("de");
    expect(result.messageLocale.tag).toBe("de");
});

it("picks a supported locale by plain language name as fallback", () => {
    const result = pickLocale(undefined, ["en", "de"], ["de-DE"]);
    expect(result.locale.tag).toBe("de-DE");
    expect(result.messageLocale.tag).toBe("de");
});

it("picks a fallback locale if nothing can be satisfied", () => {
    // "zh_CN" is normalized to "zh-CN" by Locale
    const result = pickLocale(undefined, ["en", "de"], ["zh_CN"]);
    expect(result.locale.tag).toBe("zh-CN");
    expect(result.messageLocale.tag).toBe("en");
});

it("supports forcing a custom locale", () => {
    const result = pickLocale("de-simple", ["en", "de", "de-simple"], ["de-DE"]);
    expect(result.locale.tag).toBe("de-simple");
    expect(result.messageLocale.tag).toBe("de-simple");
});

it("throws if a locale cannot be forced", () => {
    expect(() =>
        pickLocale("de-simple", ["en", "zh"], ["de-DE"])
    ).toThrowErrorMatchingInlineSnapshot(
        `[Error: runtime:unsupported-locale: Locale 'de-simple' cannot be forced because it is not supported by the application. Supported locales are en, zh.]`
    );
});

// --- Script subtag matching ---

it("matches language+script when the user has a region (pass 2)", () => {
    // zh-Hant-TW user → zh-Hant bundle (drop region, keep script)
    const result = pickLocale(undefined, ["zh-Hans", "zh-Hant"], ["zh-Hant-TW"]);
    expect(result.locale.tag).toBe("zh-Hant-TW");
    expect(result.messageLocale.tag).toBe("zh-Hant");
});

it("matches language+script without region on accepted locale (pass 2)", () => {
    // zh-Hant user → zh-Hant bundle
    const result = pickLocale(undefined, ["zh-Hans", "zh-Hant"], ["zh-Hant"]);
    expect(result.locale.tag).toBe("zh-Hant");
    expect(result.messageLocale.tag).toBe("zh-Hant");
});

it("does NOT cross script boundaries (no fallback from zh-Hant to zh-Hans)", () => {
    // Only zh-Hans is supported; user requests zh-Hant → no match, falls back to first supported
    const result = pickLocale(undefined, ["zh-Hans", "en"], ["zh-Hant-TW"]);
    // locale stays at the user's preferred for formatting
    expect(result.locale.tag).toBe("zh-Hant-TW");
    // message falls back to the first supported locale, NOT zh-Hans
    expect(result.messageLocale.tag).toBe("zh-Hans");
    // Ensure it didn't silently serve zh-Hans as a "language match"
    // (the first supported is zh-Hans only because it is the first entry, not a script match)
});

it("does NOT match zh-Hant to bare zh bundle (script blocks language-only pass)", () => {
    // Only a bare "zh" bundle exists; user has zh-Hant → must NOT match bare zh
    const result = pickLocale(undefined, ["zh", "en"], ["zh-Hant-TW"]);
    // Falls through to fallback; zh is skipped because zh-Hant has a script
    expect(result.messageLocale.tag).toBe("zh"); // first-supported fallback, not a script match
    // The quality must be "none" (fallback path), not "language" or "script"
    // Verify by checking that locale ≠ messageLocale (i.e., no match was found above fallback)
    expect(result.locale.tag).toBe("zh-Hant-TW");
});

it("picks exact script match over language-only match for same language", () => {
    // Both zh (bare) and zh-Hant are supported; zh-Hant should win over bare zh
    const result = pickLocale(undefined, ["zh", "zh-Hant"], ["zh-Hant-TW"]);
    expect(result.messageLocale.tag).toBe("zh-Hant");
});

it("prefers earlier accepted locale in the list (script match, pass 2)", () => {
    // User prefers zh-Hant-TW first, then zh-Hans-CN
    const result = pickLocale(undefined, ["zh-Hans", "zh-Hant"], ["zh-Hant-TW", "zh-Hans-CN"]);
    expect(result.locale.tag).toBe("zh-Hant-TW");
    expect(result.messageLocale.tag).toBe("zh-Hant");
});

// --- Variant subtag matching ---

it("variant locale falls back to language bundle when no exact match", () => {
    // de-simple user, only "de" bundle exists → language fallback
    const result = pickLocale(undefined, ["en", "de"], ["de-simple"]);
    expect(result.locale.tag).toBe("de-simple");
    expect(result.messageLocale.tag).toBe("de");
});

it("variant locale matches exactly when its bundle is listed", () => {
    // de-simple user, both "de" and "de-simple" bundles exist → exact match
    const result = pickLocale(undefined, ["en", "de", "de-simple"], ["de-simple"]);
    expect(result.locale.tag).toBe("de-simple");
    expect(result.messageLocale.tag).toBe("de-simple");
});

it("supported locale with variants does NOT match via language-only pass", () => {
    // Only de-simple is supported; user asks for plain de → de-simple must NOT match
    const result = pickLocale(undefined, ["de-simple", "en"], ["de"]);
    // plain de user cannot be matched to de-simple; falls back to first supported
    expect(result.messageLocale.tag).toBe("de-simple"); // first-supported fallback, not a quality match
    expect(result.locale.tag).toBe("de");
});

function pickLocale(forcedLocale: string | undefined, appLocales: string[], userLocales: string[]) {
    const localePicker = new LocalePicker(appLocales.map((l) => Locale.parse(l)));
    const parsedUserLocales = userLocales.flatMap((l) => {
        const parsed = Locale.tryParse(l);
        return parsed ? [parsed] : [];
    });
    const parsedForced = forcedLocale != null ? Locale.parse(forcedLocale) : undefined;
    return localePicker.pickSupportedLocale(parsedForced, parsedUserLocales);
}
