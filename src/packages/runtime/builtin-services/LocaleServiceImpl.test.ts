// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { expect, it } from "vitest";
import { parseLocale } from "../i18n/intl-locale";
import { AppIntl, initI18n, I18nOptions } from "../i18n/AppIntl";
import { LocaleServiceImpl } from "./LocaleServiceImpl";

it("exposes locale and messageLocale from AppIntl", async () => {
    const appIntl = await makeAppIntl(["de", "en"], { forcedLocale: "en" });
    const { service } = makeService(appIntl);

    expect(service.locale).toBeInstanceOf(Intl.Locale);
    // The forced locale 'en' may be upgraded for formatting by the browser's
    // user locale (e.g. 'en-US'); only the language is guaranteed.
    expect(service.locale.language).toBe("en");
    expect(service.messageLocale.baseName).toBe("en");
});

it("supportedMessageLocales contains all app locales", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    const tags = service.supportedMessageLocales.map((l) => l.baseName);
    expect(tags).toContain("de");
    expect(tags).toContain("en");
});

it("isReactiveSwitching reflects AppIntl.reactiveSwitching", async () => {
    const nonReactiveIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: false });
    const reactiveIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: true });

    const { service: nonReactive } = makeService(nonReactiveIntl);
    const { service: reactive2 } = makeService(reactiveIntl);

    expect(nonReactive.supportsLiveChanges).toBe(false);
    expect(reactive2.supportsLiveChanges).toBe(true);
});

it("changeLocale in non-reactive mode calls restartWithLocale", async () => {
    const restarts: (Intl.Locale | undefined)[] = [];
    const restartWithLocale = (locale: Intl.Locale | undefined) => {
        restarts.push(locale);
    };
    const appIntl = await makeAppIntl(["de", "en"], { restartWithLocale });
    const { service } = makeService(appIntl);

    service.changeLocale(parseLocale("de"));
    expect(restarts.map((l) => l?.baseName)).toEqual(["de"]);
});

it("changeLocale with undefined in non-reactive mode calls restartWithLocale with undefined", async () => {
    const restarts: (Intl.Locale | undefined)[] = [];
    const restartWithLocale = (locale: Intl.Locale | undefined) => {
        restarts.push(locale);
    };
    const appIntl = await makeAppIntl(["de", "en"], { restartWithLocale });
    const { service } = makeService(appIntl);

    service.changeLocale(undefined);
    expect(restarts).toEqual([undefined]);
});

it("changeLocale in reactive mode delegates to AppIntl.changeLocale and updates locale", async () => {
    const appIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: true });
    const { service } = makeService(appIntl);

    const initialMessageTag = service.messageLocale.baseName;
    expect(["de", "en"]).toContain(initialMessageTag);

    const otherTag = initialMessageTag === "en" ? "de" : "en";
    await service.changeLocale(parseLocale(otherTag));

    expect(service.messageLocale.baseName).toBe(otherTag);
    expect(service.locale.baseName).toBe(otherTag);
});

it("changeLocale accepts non-exact locales and preserves region for formatting", async () => {
    const appIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: true });
    const { service } = makeService(appIntl);

    await service.changeLocale(parseLocale("de-AT"));
    expect(service.messageLocale.baseName).toBe("de");
    expect(service.locale.baseName).toBe("de-AT");
});

it("changeLocale throws when the forced locale has no best-fit match", async () => {
    const appIntl = await makeAppIntl(["de", "fr"], { reactiveSwitching: true });
    const { service } = makeService(appIntl);

    await expect(service.changeLocale(parseLocale("zh-CN"))).rejects.toThrow(
        /Unsupported locale 'zh-CN'/
    );
});

it("supportsLocale returns true for exact-supported locales", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    expect(service.supportsLocale(parseLocale("de"))).toBe(true);
    expect(service.supportsLocale(parseLocale("en"))).toBe(true);
});

it("supportsLocale accepts regional variants of supported bundles", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    expect(service.supportsLocale(parseLocale("de-AT"))).toBe(true);
    expect(service.supportsLocale(parseLocale("en-GB"))).toBe(true);
    expect(service.supportsLocale(parseLocale("zh-CN"))).toBe(false);
});

it("restrictSupportedLocales=[] order is preserved", async () => {
    const appIntl = await makeAppIntl(["de", "fr", "en"], {
        restrictSupportedLocales: ["en", "fr", "de"]
    });
    const { service } = makeService(appIntl);
    expect(service.supportedMessageLocales.map((l) => l.baseName)).toEqual(["en", "fr", "de"]);
});

it("restrictSupportedLocales=[] yields empty supportedMessageLocales and messageLocale falls back to 'en'", async () => {
    // Empty supported set → picker normalizes to ['en'].
    const appIntl = await makeAppIntl(["de", "en"], {
        restrictSupportedLocales: []
    });
    const { service } = makeService(appIntl);

    expect(service.supportedMessageLocales).toHaveLength(0);
    expect(service.messageLocale.baseName).toBe("en");
});

it("restrictSupportedLocales=['de'] reduces app locales [en, de] to only 'de'", async () => {
    // App declares both "en" and "de", but only "de" is permitted by restrictSupportedLocales.
    // supportedMessageLocales must contain exactly "de" and the resolved messageLocale must be "de".
    const appIntl = await makeAppIntl(["en", "de"], {
        restrictSupportedLocales: ["de"]
    });
    const { service } = makeService(appIntl);

    const tags = service.supportedMessageLocales.map((l) => l.baseName);
    expect(tags).toEqual(["de"]);
    expect(service.messageLocale.baseName).toBe("de");
    expect(service.supportsLocale(parseLocale("de"))).toBe(true);
    expect(service.supportsLocale(parseLocale("en"))).toBe(false);
});

it("throws at startup when restrictSupportedLocales is not a subset of the app's locales", async () => {
    await expect(makeAppIntl(["de", "en"], { restrictSupportedLocales: ["fr"] })).rejects.toThrow(
        /not one of the application's message locales \[de, en\]/
    );
});

/**
 * Builds a real AppIntl from a small set of app locales and an optional forced locale.
 * No message loading (no appMetadata); only locale resolution is exercised.
 */
async function makeAppIntl(
    appLocales: string[],
    options?: {
        forcedLocale?: string;
        reactiveSwitching?: boolean;
        restartWithLocale?: (locale: Intl.Locale | undefined) => void;
        restrictSupportedLocales?: readonly string[];
    }
): Promise<AppIntl> {
    const appMetadata = {
        locales: appLocales,
        packages: {},
        styles: reactive("")
    } as I18nOptions["appMetadata"];
    return initI18n({
        appMetadata,
        forcedLocale: options?.forcedLocale,
        supportsLiveChanges: options?.reactiveSwitching ?? false,
        restartWithLocale: options?.restartWithLocale ?? (() => {}),
        restrictSupportedLocales: options?.restrictSupportedLocales
    });
}

function makeService(appIntl: AppIntl): {
    service: LocaleServiceImpl;
} {
    const service = new LocaleServiceImpl({
        appIntl
    });
    return { service };
}
