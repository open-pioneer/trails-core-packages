// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { createService } from "@open-pioneer/test-utils/services";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalStorageServiceImpl } from "./LocalStorageServiceImpl";
import { SessionStorageServiceImpl } from "./SessionStorageServiceImpl";

const DEFAULT_STORAGE_ID = "test-storage-id";

const MOCKED_LOCAL_STORAGE = new Map<string, string>();
const MOCKED_SESSION_STORAGE = new Map<string, string>();

const VARIANTS = [
    {
        label: "local storage",
        property: "localStorage",
        mockedStorage: MOCKED_LOCAL_STORAGE,
        Impl: LocalStorageServiceImpl
    },
    {
        label: "session storage",
        property: "sessionStorage",
        mockedStorage: MOCKED_SESSION_STORAGE,
        Impl: SessionStorageServiceImpl
    }
] as const;

beforeEach(() => {
    vi.useFakeTimers();
    mockStorage(window.localStorage, MOCKED_LOCAL_STORAGE);
    mockStorage(window.sessionStorage, MOCKED_SESSION_STORAGE);
});

afterEach(() => {
    MOCKED_LOCAL_STORAGE.clear();
    MOCKED_SESSION_STORAGE.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe.for(VARIANTS)("$label", ({ label, property, mockedStorage, Impl }) => {
    const NOT_SUPPORTED = new RegExp(`This browser does not support ${label}\\.$`);

    it("is supported by default", () => {
        const storageService = setup();
        expect(storageService.isSupported).toBe(true);
    });

    it("detects missing storage", () => {
        vi.spyOn(window, property, "get").mockReturnValue(undefined as any);
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const storageService = setup();
        expect(storageService.isSupported).toBe(false);
        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(expect.stringMatching(NOT_SUPPORTED));

        expect(() => storageService.get("foo")).toThrow(
            `local-storage:not-supported: This browser does not support ${label}.`
        );
    });

    it("reports errors if storage does not work", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        vi.spyOn(window, property, "get").mockImplementation(() => {
            throw new Error("Some problem!");
        });

        const storageService = setup();
        expect(storageService.isSupported).toBe(false);
        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
            expect.stringMatching(NOT_SUPPORTED),
            expect.objectContaining({ message: "Some problem!" })
        );
    });

    it("persists data", () => {
        const storageService = setup();
        storageService.set("foo", "bar");
        storageService.set("answer", 42);
        storageService.set("null", null);
        storageService.set("isAdmin", true);
        storageService.set("array", [1, 2, 3]);
        storageService.set("object", { baz: "qux" });

        expect(getStorageData()).toEqual({
            foo: "bar",
            answer: 42,
            null: null,
            isAdmin: true,
            array: [1, 2, 3],
            object: { baz: "qux" }
        });
    });

    it("restores previous data on next run", () => {
        mockedStorage.set(
            DEFAULT_STORAGE_ID,
            JSON.stringify({
                answer: 42,
                object: {
                    baz: "qux"
                }
            })
        );

        const storageService = setup();
        expect(storageService.get("answer")).toBe(42);
        expect(storageService.get("object")).toEqual({
            baz: "qux"
        });
    });

    it("overwrites invalid data on load", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        mockedStorage.set(DEFAULT_STORAGE_ID, "garbage");

        setup();
        expect(getStorageData()).toEqual({});

        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
            expect.stringMatching(/Invalid persisted data, reverting to default\.$/),
            expect.objectContaining({ message: expect.stringMatching(/unexpected token/i) })
        );
    });

    it("flushes pending changes on destroy()", () => {
        const storageService = setup();
        storageService.set("foo", "bar");

        // No timer advance: the debounced save is still pending.
        storageService.destroy();

        expect(JSON.parse(mockedStorage.get(DEFAULT_STORAGE_ID)!)).toEqual({ foo: "bar" });
    });

    it("returns previously set values in get()", () => {
        const storageService = setup();
        storageService.set("foo", "bar");
        expect(storageService.get("foo")).toBe("bar");
    });

    it("clones values to avoid accidental side effects", () => {
        const foo = {
            bar: 2
        };

        const storageService = setup();
        storageService.set("foo", foo);
        foo.bar += 1;

        const foo2 = storageService.get("foo") as typeof foo;
        expect(foo2).not.toBe(foo);
        expect(foo2.bar).toBe(2);
    });

    it("returns undefined for missing values", () => {
        const storageService = setup();
        expect(storageService.get("foo")).toBeUndefined();
    });

    it("allows removing a key", () => {
        const storageService = setup();
        storageService.set("foo", "bar");
        expect(storageService.get("foo")).toBe("bar");

        storageService.remove("foo");
        expect(storageService.get("foo")).toBeUndefined();
    });

    it("supports removing all keys", () => {
        const storageService = setup();
        storageService.set("foo", "bar");
        storageService.set("answer", 42);
        storageService.removeAll();

        expect(getStorageData()).toEqual({});
    });

    it("throws for invalid values", () => {
        const storageService = setup();
        const expectedError = `local-storage:invalid-value: The value is not supported by ${label}.`;
        expect(() => storageService.set("foo", () => 1)).toThrow(expectedError);
        expect(() => storageService.set("foo", Symbol("symbol"))).toThrow(expectedError);
        expect(() => storageService.set("foo", BigInt(1))).toThrow(expectedError);
    });

    it("detects missing storage id", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const storageService = setup({
            storageId: undefined
        });
        expect(storageService.isSupported).toBe(true);
        expect(warnSpy).toHaveBeenCalledExactlyOnceWith(
            expect.stringMatching(/The 'storageId' property .* Defaulting to 'trails-state'\.$/)
        );
    });

    describe("nested namespaces", () => {
        it("supports creating a nested namespace", () => {
            const storageService = setup();
            const namespace = storageService.getNamespace("toc");
            namespace.set("foo", "bar");

            expect(getStorageData()).toEqual({
                toc: {
                    foo: "bar"
                }
            });
        });

        it("supports removing keys", () => {
            const storageService = setup();
            const namespace = storageService.getNamespace("toc");
            namespace.set("foo", "bar");
            namespace.set("bar", "baz");
            namespace.remove("foo");

            expect(getStorageData()).toEqual({
                toc: {
                    bar: "baz"
                }
            });
        });

        it("clearing a namespace only removes the nested properties", () => {
            const storageService = setup();
            storageService.set("outer", 1);

            const namespace = storageService.getNamespace("nested");
            namespace.set("inner", 2);
            namespace.removeAll();

            expect(getStorageData()).toEqual({
                nested: {},
                outer: 1
            });
        });

        it("supports deeply nested namespaces", () => {
            const storageService = setup();
            const namespace = storageService.getNamespace("a").getNamespace("b").getNamespace("c");
            namespace.set("foo", "bar");
            expect(getStorageData()).toEqual({
                a: {
                    b: {
                        c: {
                            foo: "bar"
                        }
                    }
                }
            });
        });

        it("returns the same values from namespace objects referencing the same key", () => {
            const storageService = setup();
            const ns1 = storageService.getNamespace("ns");
            const ns2 = storageService.getNamespace("ns");

            ns1.set("foo", "bar");
            expect(ns1).not.toBe(ns2); // different instances ...
            expect(ns2.get("foo")).toBe("bar"); // observe the same values
        });

        it("throws if getNamespace() is called for a non-object value", () => {
            const storageService = setup();
            storageService.set("a", "invalid");
            expect(() => storageService.getNamespace("a")).toThrow(
                "local-storage:invalid-path: Cannot use 'a' as a namespace because it is not associated with an object."
            );
        });

        it("throws if a parent is not an object (set)", () => {
            const storageService = setup();
            const namespace = storageService.getNamespace("a");
            storageService.set("a", 123);
            expect(() => namespace.set("foo", 456)).toThrow(
                "local-storage:invalid-path: Cannot set property on 'a' because it is no object."
            );
        });

        it("throws if a parent is not an object (get)", () => {
            const storageService = setup();
            const namespace = storageService.getNamespace("a");
            storageService.set("a", 123);
            expect(() => namespace.get("foo")).toThrow(
                "local-storage:invalid-path: Cannot get nested property 'foo' because the parent is no object."
            );
        });

        it("returns the namespace's object value on get", () => {
            const storageService = setup();
            const packageNamespace = storageService.getNamespace("my-package-name");
            packageNamespace.set("foo", "bar");

            const backingObject = storageService.get("my-package-name");
            expect(backingObject).toEqual({ foo: "bar" });
        });
    });

    function setup(options?: { storageId?: string }) {
        const storageId =
            options && "storageId" in options ? options.storageId : DEFAULT_STORAGE_ID;
        return createService(Impl, {
            properties: {
                storageId
            }
        });
    }

    function getStorageData() {
        // Wait for internal timeouts (debounced save)
        vi.advanceTimersByTime(25);

        const entry = mockedStorage.get(DEFAULT_STORAGE_ID);
        if (entry == null) {
            throw new Error(`No data in ${label}`);
        }
        return JSON.parse(entry);
    }
});

it("keeps local storage and session storage independent for the same storage id", () => {
    const localService = createService(LocalStorageServiceImpl, {
        properties: { storageId: DEFAULT_STORAGE_ID }
    });
    const sessionService = createService(SessionStorageServiceImpl, {
        properties: { storageId: DEFAULT_STORAGE_ID }
    });

    localService.set("foo", "local-value");
    sessionService.set("foo", "session-value");
    vi.advanceTimersByTime(25);

    expect(JSON.parse(MOCKED_LOCAL_STORAGE.get(DEFAULT_STORAGE_ID)!)).toEqual({
        foo: "local-value"
    });
    expect(JSON.parse(MOCKED_SESSION_STORAGE.get(DEFAULT_STORAGE_ID)!)).toEqual({
        foo: "session-value"
    });
});

function mockStorage(storage: Storage, data: Map<string, string>) {
    vi.spyOn(storage, "setItem").mockImplementation((key, value) => data.set(key, value));
    vi.spyOn(storage, "getItem").mockImplementation((key) => data.get(key) ?? null);

    vi.spyOn(storage, "removeItem").mockImplementation(notImplemented);
    vi.spyOn(storage, "clear").mockImplementation(notImplemented);
    vi.spyOn(storage, "length", "get").mockImplementation(notImplemented);
}

function notImplemented(): never {
    throw new Error("not implemented");
}
