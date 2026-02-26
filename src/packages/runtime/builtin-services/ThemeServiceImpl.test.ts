// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeServiceImpl } from "./ThemeServiceImpl";

afterEach(() => {
    vi.restoreAllMocks(); // clean up spies between tests
});

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

    service.setColorMode("dark");
    expect(service.colorMode).toBe("dark");
});

it("updates color mode back to 'light' when called with a direct value", () => {
    const service = new ThemeServiceImpl({ initialColorMode: "dark" });
    expect(service.colorMode).toBe("dark");

    service.setColorMode("light");
    expect(service.colorMode).toBe("light");
});

it("accepts a supplier function and uses its return value", () => {
    const service = new ThemeServiceImpl({});
    service.setColorMode(() => "dark");
    expect(service.colorMode).toBe("dark");
});

it("reacts to changes of a reactive supplier", () => {
    const mode = reactive<"light" | "dark">("light");
    const service = new ThemeServiceImpl({});

    service.setColorMode(() => mode.value);
    expect(service.colorMode).toBe("light");

    mode.value = "dark";
    expect(service.colorMode).toBe("dark");

    mode.value = "light";
    expect(service.colorMode).toBe("light");
});

it("replaces a supplier function with a direct value", () => {
    const service = new ThemeServiceImpl({});
    service.setColorMode(() => "dark");
    expect(service.colorMode).toBe("dark");

    service.setColorMode("light");
    expect(service.colorMode).toBe("light");
});

describe("system color mode", () => {
    it("systemColorMode is 'dark' when prefers-color-scheme is dark", () => {
        mockPrefersDark(true);
        const service = new ThemeServiceImpl({});
        expect(service.systemColorMode).toBe("dark");
    });

    it("systemColorMode is 'light' when prefers-color-scheme is light", () => {
        mockPrefersDark(false);
        const service = new ThemeServiceImpl({});
        expect(service.systemColorMode).toBe("light");
    });

    it("systemColorMode reacts to OS preference changes", () => {
        const mql = mockPrefersDark(false);
        const service = new ThemeServiceImpl({});
        expect(service.systemColorMode).toBe("light");

        mql.change(true);
        expect(service.systemColorMode).toBe("dark");

        mql.change(false);
        expect(service.systemColorMode).toBe("light");
    });
});

function mockPrefersDark(prefersDark: boolean) {
    const listeners = new Set<() => void>();
    const mql = {
        matches: prefersDark,
        addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
        /** Simulate the OS switching its color scheme preference */
        change(dark: boolean) {
            this.matches = dark;
            listeners.forEach((l) => l());
        }
    };
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);
    return mql;
}
