// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { I18nConfig } from "./i18n";

it("picks a supported locale by default", () => {
    const appLocales = ["en", "de"];
    const userLocales = ["de"];
    const result = pickLocale(undefined, appLocales, userLocales);
    expect(result).toEqual({
        locale: "de",
        messageLocale: "de"
    });
});

it("picks a supported locale by plain language name as fallback", () => {
    const appLocales = ["en", "de"];
    const userLocales = ["de-DE"];
    const result = pickLocale(undefined, appLocales, userLocales);
    expect(result).toEqual({
        locale: "de-DE",
        messageLocale: "de"
    });
});

it("picks a fallback locale if nothing can be satisfied", () => {
    const appLocales = ["en", "de"];
    const userLocales = ["zh_CN"];
    const result = pickLocale(undefined, appLocales, userLocales);
    expect(result).toEqual({
        locale: "zh_CN",
        messageLocale: "en"
    });
});

it("supports forcing a custom locale", () => {
    const appLocales = ["en", "de", "de-simple"];
    const userLocales = ["de-DE"];
    const result = pickLocale("de-simple", appLocales, userLocales);
    expect(result).toEqual({
        locale: "de-simple",
        messageLocale: "de-simple"
    });
});

it("throws if a locale cannot be forced", () => {
    const appLocales = ["en", "zh"];
    const userLocales = ["de-DE"];
    expect(() =>
        pickLocale("de-simple", appLocales, userLocales)
    ).toThrowErrorMatchingInlineSnapshot(
        `[Error: runtime:unsupported-locale: Locale 'de-simple' cannot be forced because it is not supported by the application. Supported locales are en, zh.]`
    );
});

it("computes whether a locale is supported", () => {
    // Simple cases
    expect(supportsLocale("en", ["en", "de"])).toBe(true);
    expect(supportsLocale("de", ["en", "de"])).toBe(true);

    // Fallback to plain language tag
    expect(supportsLocale("de-DE", ["en", "de"])).toBe(true);

    // Not supported at all
    expect(supportsLocale("de", ["en"])).toBe(false);
    expect(supportsLocale("de-DE", ["en"])).toBe(false);
});

function pickLocale(forcedLocale: string | undefined, appLocales: string[], userLocales: string[]) {
    const config = new I18nConfig(appLocales);
    return config.pickSupportedLocale(forcedLocale, userLocales);
}

function supportsLocale(testLocale: string, appLocales: string[]) {
    const config = new I18nConfig(appLocales);
    return config.supportsLocale(testLocale);
}
