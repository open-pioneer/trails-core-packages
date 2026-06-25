// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from "vitest";
import { LocalePicker } from "./pick";
import { parseLocale, tryParseLocale } from "./intl-locale";

describe("browser-only matching (no preferredLocale)", () => {
    it("picks a supported locale that matches the user's browser language", () => {
        const result = pickLocale(undefined, ["en", "de"], ["de"]);
        expect(result.locale.baseName).toBe("de");
        expect(result.messageLocale.baseName).toBe("de");
    });

    it("falls back to the language bundle when no regional bundle exists", () => {
        const result = pickLocale(undefined, ["en", "de"], ["de-DE"]);
        expect(result.locale.baseName).toBe("de-DE");
        expect(result.messageLocale.baseName).toBe("de");
    });

    it("variant locale: bundle falls back to language and variant subtag is dropped from formatting locale", () => {
        // The formatting picker only considers language/script/region, so the
        // variant subtag is not preserved when upgrading from the message locale.
        const result = pickLocale(undefined, ["en", "de"], ["de-simple"]);
        expect(result.locale.baseName).toBe("de");
        expect(result.messageLocale.baseName).toBe("de");
    });

    it("variant locale matches exactly when its bundle is listed", () => {
        const result = pickLocale(undefined, ["en", "de", "de-simple"], ["de-simple"]);
        expect(result.locale.baseName).toBe("de-simple");
        expect(result.messageLocale.baseName).toBe("de-simple");
    });

    it("prefers earlier accepted user locale in the list", () => {
        const result = pickLocale(undefined, ["zh-Hans", "zh-Hant"], ["zh-Hant-TW", "zh-Hans-CN"]);
        expect(result.locale.baseName).toBe("zh-Hant-TW");
        expect(result.messageLocale.baseName).toBe("zh-Hant");
    });
});

describe("script subtag matching", () => {
    it("matches language+script when the user has a region", () => {
        const result = pickLocale(undefined, ["zh-Hans", "zh-Hant"], ["zh-Hant-TW"]);
        expect(result.locale.baseName).toBe("zh-Hant-TW");
        expect(result.messageLocale.baseName).toBe("zh-Hant");
    });

    it("matches language+script without region on accepted locale", () => {
        const result = pickLocale(undefined, ["zh-Hans", "zh-Hant"], ["zh-Hant"]);
        expect(result.locale.baseName).toBe("zh-Hant");
        expect(result.messageLocale.baseName).toBe("zh-Hant");
    });

    it("picks exact script match over language-only match for same language", () => {
        const result = pickLocale(undefined, ["zh", "zh-Hant"], ["zh-Hant-TW"]);
        expect(result.messageLocale.baseName).toBe("zh-Hant");
    });
});

describe("regional bundle picking", () => {
    it("picks de-CH exactly for a Swiss-German user", () => {
        const result = pickLocale(undefined, ["de-CH", "de-DE", "en"], ["de-CH"]);
        expect(result.locale.baseName).toBe("de-CH");
        expect(result.messageLocale.baseName).toBe("de-CH");
    });

    it("keeps the message bundle's region for formatting when the user's region differs", () => {
        // 'de-AT' user, supported bundles 'de-CH'/'de-DE'/'en'. Best-fit picks one
        // of the German regional bundles; the formatting locale stays at that
        // bundle's region instead of adopting 'de-AT' because the formatting
        // picker requires regional agreement once the message locale has a region.
        const result = pickLocale(undefined, ["de-CH", "de-DE", "en"], ["de-AT"]);
        expect(["de-CH", "de-DE"]).toContain(result.messageLocale.baseName);
        expect(result.locale.baseName).toBe(result.messageLocale.baseName);
    });

    it("picks de-DE for a bare 'de' user when both de-CH and de-DE are supported", () => {
        const result = pickLocale(undefined, ["de-CH", "de-DE", "en"], ["de"]);
        expect(result.messageLocale.baseName).toBe("de-DE");
        // No region on the user side: formatting locale falls back to messageLocale
        // because picking 'de' would downgrade the region.
        expect(result.locale.baseName).toBe("de-DE");
    });

    it("groups regional English variants and keeps the message bundle region for formatting", () => {
        // 'en-AU' user → message bundle 'en-GB'. Formatting stays at 'en-GB' since
        // 'en-AU' would change the region away from the message bundle's region.
        const result = pickLocale(undefined, ["en-US", "en-GB", "de"], ["en-AU"]);
        expect(result.messageLocale.baseName).toBe("en-GB");
        expect(result.locale.baseName).toBe("en-GB");
    });
});

describe("formatting locale derivation", () => {
    it("uses the first browser locale whose language matches the message locale", () => {
        const result = pickLocale(undefined, ["en", "de"], ["en-US", "de-AT", "fr-FR"]);
        expect(result.messageLocale.baseName).toBe("en");
        expect(result.locale.baseName).toBe("en-US");
    });

    it("uses the user's region for formatting even when message bundle is region-less", () => {
        const result = pickLocale(undefined, ["de", "en"], ["de-AT"]);
        expect(result.messageLocale.baseName).toBe("de");
        expect(result.locale.baseName).toBe("de-AT");
    });

    it("requires script agreement when the message locale specifies a script", () => {
        const result = pickLocale(undefined, ["zh-Hant", "en"], ["zh-Hans-CN"]);
        if (result.messageLocale.baseName === "zh-Hant") {
            expect(result.locale.baseName).toBe("zh-Hant");
        }
    });
});

describe("no-overlap edge case", () => {
    it("uses the first configured supported locale for both message and formatting", () => {
        const result = pickLocale(undefined, ["de", "en"], ["fr-FR"]);
        expect(result.messageLocale.baseName).toBe("de");
        expect(result.locale.baseName).toBe("de");
    });

    it("uses the first configured supported locale when user locales are empty", () => {
        const result = pickLocale(undefined, ["de", "en"], []);
        expect(result.messageLocale.baseName).toBe("de");
        expect(result.locale.baseName).toBe("de");
    });

    it("uses 'en' first when 'en' is listed first", () => {
        const result = pickLocale(undefined, ["en", "de"], ["fr-FR"]);
        expect(result.messageLocale.baseName).toBe("en");
        expect(result.locale.baseName).toBe("en");
    });
});

describe("preferred (forced) locale", () => {
    it("returns the forced locale when exactly supported", () => {
        const result = pickLocale("de", ["en", "de"], []);
        expect(result.messageLocale.baseName).toBe("de");
        expect(result.locale.baseName).toBe("de");
    });

    it("maps to a less-specific bundle silently", () => {
        // 'de-CH' forced, only bare 'de' supported → message bundle 'de',
        // formatting keeps the caller's regional intent.
        const result = pickLocale("de-CH", ["en", "de"], []);
        expect(result.messageLocale.baseName).toBe("de");
        expect(result.locale.baseName).toBe("de-CH");
    });

    it("region upgrade from user locale wins over variant subtag", () => {
        // 'de-simple' is exactly supported as a message bundle, but the formatting
        // locale picker only considers language/script/region, so a user locale
        // with a matching language and a region (de-DE) upgrades the formatting
        // locale to 'de-DE'.
        const result = pickLocale("de-simple", ["en", "de", "de-simple"], ["de-DE"]);
        expect(result.messageLocale.baseName).toBe("de-simple");
        expect(result.locale.baseName).toBe("de-DE");
    });

    it("throws when no best-fit match exists, regardless of browser locales", () => {
        expect(() => pickLocale("fr-FR", ["en", "de"], [])).toThrow(/Unsupported locale 'fr-FR'/);
        expect(() => pickLocale("fr-FR", ["en", "de"], ["ja"])).toThrow(
            /Unsupported locale 'fr-FR'/
        );
        expect(() => pickLocale("fr-FR", ["en", "de"], ["en-US"])).toThrow(
            /Unsupported locale 'fr-FR'/
        );
        expect(() => pickLocale("fr-FR", ["en", "de"], ["de-AT"])).toThrow(
            /Unsupported locale 'fr-FR'/
        );
    });

    it("throws with the supported locales listed in the error message", () => {
        expect(() =>
            pickLocale("de-simple", ["en", "zh"], ["de-DE"])
        ).toThrowErrorMatchingInlineSnapshot(
            `[Error: runtime:unsupported-locale: Unsupported locale 'de-simple' (supported locales: en, zh).]`
        );
    });
});

describe("empty supported list (treated as ['en'])", () => {
    it("behaves as if ['en'] were configured (browser only)", () => {
        const result = pickLocale(undefined, [], ["fr-FR"]);
        expect(result.messageLocale.baseName).toBe("en");
        // 'fr-FR' has a different language than the message locale → not used
        // for formatting; falls back to messageLocale.
        expect(result.locale.baseName).toBe("en");
    });

    it("uses browser region when language matches 'en'", () => {
        const result = pickLocale(undefined, [], ["en-US"]);
        expect(result.messageLocale.baseName).toBe("en");
        expect(result.locale.baseName).toBe("en-US");
    });

    it("empty browser locales → en / en", () => {
        const result = pickLocale(undefined, [], []);
        expect(result.messageLocale.baseName).toBe("en");
        expect(result.locale.baseName).toBe("en");
    });

    it("forced 'en' succeeds", () => {
        const result = pickLocale("en", [], []);
        expect(result.messageLocale.baseName).toBe("en");
        expect(result.locale.baseName).toBe("en");
    });

    it("forced locale that cannot best-fit 'en' throws", () => {
        expect(() => pickLocale("de", [], [])).toThrow(/Unsupported locale 'de'/);
        expect(() => pickLocale("de-CH", [], [])).toThrow(/Unsupported locale 'de-CH'/);
    });
});

it("invariant: locale.language always equals messageLocale.language", () => {
    const cases: { forced?: string; app: string[]; user: string[] }[] = [
        { app: ["en", "de"], user: ["de-AT"] },
        { app: ["en", "de"], user: ["fr-FR"] },
        { app: ["en", "de"], user: [] },
        { app: ["zh-Hant", "en"], user: ["zh-Hans-CN"] },
        { app: [], user: ["fr-FR"] },
        { app: ["en", "de"], user: [], forced: "de-CH" },
        { app: ["en", "de", "de-simple"], user: ["de-DE"], forced: "de-simple" }
    ];
    for (const c of cases) {
        const r = pickLocale(c.forced, c.app, c.user);
        expect(r.locale.language).toBe(r.messageLocale.language);
    }
});

describe("supportsLocale", () => {
    it("accepts exact and regional variants of supported bundles", () => {
        const picker = new LocalePicker(["en", "de"].map(parseLocale));
        expect(picker.supportsLocale(parseLocale("de"))).toBe(true);
        expect(picker.supportsLocale(parseLocale("en"))).toBe(true);
        expect(picker.supportsLocale(parseLocale("de-AT"))).toBe(true);
        expect(picker.supportsLocale(parseLocale("en-GB"))).toBe(true);
        expect(picker.supportsLocale(parseLocale("fr"))).toBe(false);
        expect(picker.supportsLocale(parseLocale("zh-CN"))).toBe(false);
    });

    it("on empty config normalizes to ['en']", () => {
        const picker = new LocalePicker([]);
        expect(picker.supportsLocale(parseLocale("en"))).toBe(true);
        expect(picker.supportsLocale(parseLocale("en-US"))).toBe(true);
        expect(picker.supportsLocale(parseLocale("fr"))).toBe(false);
    });
});

function pickLocale(forcedLocale: string | undefined, appLocales: string[], userLocales: string[]) {
    const localePicker = new LocalePicker(appLocales.map((l) => parseLocale(l)));
    const parsedUserLocales = userLocales.flatMap((l) => {
        const parsed = tryParseLocale(l);
        return parsed ? [parsed] : [];
    });
    const parsedForced = forcedLocale != null ? parseLocale(forcedLocale) : undefined;
    return localePicker.pickSupportedLocale(parsedForced, parsedUserLocales);
}
