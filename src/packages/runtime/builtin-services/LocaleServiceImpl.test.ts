// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { expect, it } from "vitest";
import { Locale } from "../i18n/Locale";
import { AppIntl, initI18n, I18nOptions } from "../i18n/AppIntl";
import { LocaleServiceImpl } from "./LocaleServiceImpl";

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Builds a real AppIntl from a small set of app locales and an optional forced locale.
 * No message loading (no appMetadata); only locale resolution is exercised.
 */
async function makeAppIntl(
    appLocales: string[],
    options?: {
        forcedLocale?: string;
        reactiveSwitching?: boolean;
        restartWithLocale?: (locale: Locale | undefined) => void;
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
        reactiveSwitching: options?.reactiveSwitching ?? false,
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

// ─── tests ───────────────────────────────────────────────────────────────────

it("exposes locale and messageLocale from AppIntl", async () => {
    const appIntl = await makeAppIntl(["de", "en"], { forcedLocale: "en" });
    const { service } = makeService(appIntl);

    expect(service.locale).toBeInstanceOf(Locale);
    expect(service.locale.tag).toBe("en");
    expect(service.messageLocale.tag).toBe("en");
});

it("supportedMessageLocales contains all app locales", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    const tags = service.supportedMessageLocales.map((l) => l.tag);
    expect(tags).toContain("de");
    expect(tags).toContain("en");
});

it("supportedMessageLocales contains all app locales", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    const tags = service.supportedMessageLocales.map((l) => l.tag);
    expect(tags).toContain("de");
    expect(tags).toContain("en");
});

it("isReactiveSwitching reflects AppIntl.reactiveSwitching", async () => {
    const nonReactiveIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: false });
    const reactiveIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: true });

    const { service: nonReactive } = makeService(nonReactiveIntl);
    const { service: reactive2 } = makeService(reactiveIntl);

    expect(nonReactive.isReactiveSwitching).toBe(false);
    expect(reactive2.isReactiveSwitching).toBe(true);
});

it("setLocale in non-reactive mode calls restartWithLocale", async () => {
    const restarts: (Locale | undefined)[] = [];
    const restartWithLocale = (locale: Locale | undefined) => {
        restarts.push(locale);
    };
    const appIntl = await makeAppIntl(["de", "en"], { restartWithLocale });
    const { service } = makeService(appIntl);

    service.setLocale(Locale.parse("de"));
    expect(restarts.map((l) => l?.tag)).toEqual(["de"]);
});

it("setLocale with undefined in non-reactive mode calls restartWithLocale with undefined", async () => {
    const restarts: (Locale | undefined)[] = [];
    const restartWithLocale = (locale: Locale | undefined) => {
        restarts.push(locale);
    };
    const appIntl = await makeAppIntl(["de", "en"], { restartWithLocale });
    const { service } = makeService(appIntl);

    service.setLocale(undefined);
    expect(restarts).toEqual([undefined]);
});

it("setLocale in reactive mode delegates to AppIntl.setLocale and updates locale", async () => {
    const appIntl = await makeAppIntl(["de", "en"], { reactiveSwitching: true });
    const { service } = makeService(appIntl);

    const initialMessageTag = service.messageLocale.tag;
    expect(["de", "en"]).toContain(initialMessageTag);

    const otherTag = initialMessageTag === "en" ? "de" : "en";
    await service.setLocale(Locale.parse(otherTag));

    expect(service.messageLocale.tag).toBe(otherTag);
    expect(service.locale.tag).toBe(otherTag);
});

it("supportsLocale returns true for supported locales", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    expect(service.supportsLocale(Locale.parse("de"))).toBe(true);
    expect(service.supportsLocale(Locale.parse("en"))).toBe(true);
});

it("supportsLocale returns false for unsupported locales", async () => {
    const appIntl = await makeAppIntl(["de", "en"]);
    const { service } = makeService(appIntl);

    expect(service.supportsLocale(Locale.parse("zh-CN"))).toBe(false);
    expect(service.supportsLocale(Locale.parse("fr"))).toBe(false);
});

it("restrictSupportedLocales=[] order is preserved", async () => {
    const appIntl = await makeAppIntl(["de", "fr", "en"], {
        restrictSupportedLocales: ["en", "fr", "de"]
    });
    const { service } = makeService(appIntl);
    expect(service.supportedMessageLocales.map((l) => l.tag)).toEqual(["en", "fr", "de"]);
});

it("restrictSupportedLocales=[] yields empty supportedMessageLocales and messageLocale falls back to 'en'", async () => {
    // App declares "de" and "en", but all are restricted away via an empty list.
    // filterAvailableLocales produces no valid locales, so LocalePicker has nothing to match.
    // pickSupportedLocale falls back to Locale.parse("en") for the messageLocale.
    const appIntl = await makeAppIntl(["de", "en"], {
        restrictSupportedLocales: []
    });
    const { service } = makeService(appIntl);

    expect(service.supportedMessageLocales).toHaveLength(0);
    expect(service.messageLocale.tag).toBe("en");
});

it("restrictSupportedLocales=['de'] reduces app locales [en, de] to only 'de'", async () => {
    // App declares both "en" and "de", but only "de" is permitted by restrictSupportedLocales.
    // supportedMessageLocales must contain exactly "de" and the resolved messageLocale must be "de".
    const appIntl = await makeAppIntl(["en", "de"], {
        restrictSupportedLocales: ["de"]
    });
    const { service } = makeService(appIntl);

    const tags = service.supportedMessageLocales.map((l) => l.tag);
    expect(tags).toEqual(["de"]);
    expect(service.messageLocale.tag).toBe("de");
    expect(service.supportsLocale(Locale.parse("de"))).toBe(true);
    expect(service.supportsLocale(Locale.parse("en"))).toBe(false);
});
