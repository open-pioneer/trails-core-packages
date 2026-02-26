// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { expect, it } from "vitest";
import { ThemeServiceImpl } from "./ThemeServiceImpl";

it("defaults to 'light' when no properties are given", () => {
    const service = new ThemeServiceImpl({});
    expect(service.colorMode).toBe("light");
});

it("uses 'light' when initialColorMode is 'light'", () => {
    const service = new ThemeServiceImpl({ initialColorMode: "light" });
    expect(service.colorMode).toBe("light");
});

it("uses 'dark' when initialColorMode is 'dark'", () => {
    const service = new ThemeServiceImpl({ initialColorMode: "dark" });
    expect(service.colorMode).toBe("dark");
});

it("defaults to 'light' when initialColorMode is undefined", () => {
    const service = new ThemeServiceImpl({ initialColorMode: undefined });
    expect(service.colorMode).toBe("light");
});

it("updates color mode to 'dark' when called with a direct value", () => {
    const service = new ThemeServiceImpl({});
    expect(service.colorMode).toBe("light");

    service.updateColorMode("dark");
    expect(service.colorMode).toBe("dark");
});

it("updates color mode back to 'light' when called with a direct value", () => {
    const service = new ThemeServiceImpl({ initialColorMode: "dark" });
    expect(service.colorMode).toBe("dark");

    service.updateColorMode("light");
    expect(service.colorMode).toBe("light");
});

it("accepts a supplier function and uses its return value", () => {
    const service = new ThemeServiceImpl({});
    service.updateColorMode(() => "dark");
    expect(service.colorMode).toBe("dark");
});

it("reacts to changes of a reactive supplier", () => {
    const mode = reactive<"light" | "dark">("light");
    const service = new ThemeServiceImpl({});

    service.updateColorMode(() => mode.value);
    expect(service.colorMode).toBe("light");

    mode.value = "dark";
    expect(service.colorMode).toBe("dark");

    mode.value = "light";
    expect(service.colorMode).toBe("light");
});

it("replaces a supplier function with a direct value", () => {
    const service = new ThemeServiceImpl({});
    service.updateColorMode(() => "dark");
    expect(service.colorMode).toBe("dark");

    service.updateColorMode("light");
    expect(service.colorMode).toBe("light");
});
