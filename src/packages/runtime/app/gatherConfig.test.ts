// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { expect, it } from "vitest";
import { CustomElementOptions } from "../CustomElement";
import { gatherConfig } from "./gatherConfig";

it("keeps static config values when resolveConfig returns undefined for them", async () => {
    const hostElement = document.createElement("div");
    const options: CustomElementOptions = {
        component: () => null,
        config: {
            locale: "de",
            colorMode: "dark",
            supportedLocales: ["de", "en"]
        },
        resolveConfig: async (_ctx) => ({
            locale: undefined,
            colorMode: undefined,
            supportedLocales: undefined
        })
    };

    const config = await gatherConfig(hostElement, options);
    expect(config.locale).toBe("de");
    expect(config.colorMode).toBe("dark");
    expect(config.supportedLocales).toEqual(["de", "en"]);
});

it("lets defined values from resolveConfig take precedence over the static config", async () => {
    const hostElement = document.createElement("div");
    hostElement.setAttribute("lang", "en");
    const options: CustomElementOptions = {
        component: () => null,
        config: {
            locale: "de",
            properties: { pkg: { a: 1, b: 1 } }
        },
        resolveConfig: async (ctx) => ({
            locale: ctx.getAttribute("lang"),
            properties: { pkg: { b: 2 } }
        })
    };

    const config = await gatherConfig(hostElement, options);
    expect(config.locale).toBe("en");
    expect(config.properties).toEqual({ pkg: { a: 1, b: 2 } });
});
