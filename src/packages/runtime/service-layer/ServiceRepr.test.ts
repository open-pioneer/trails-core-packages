// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { constant, reactive, ReadonlyReactive } from "@conterra/reactivity-core";
import { afterEach, expect, it, vi } from "vitest";
import { createEmptyPackageIntl, createPackageIntl, PackageIntl } from "../i18n";
import { Service, ServiceOptions } from "../Service";
import { createConstructorFactory, ServiceRepr } from "./ServiceRepr";

afterEach(() => {
    vi.restoreAllMocks();
});

it("emits a deprecation warning via console.warn when `intl` is accessed", function () {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    let capturedOptions: ServiceOptions | undefined;
    class TestService implements Service {
        constructor(options: ServiceOptions) {
            capturedOptions = options;
        }
    }

    const repr = constructService(TestService);

    // Access triggers the deprecation
    void capturedOptions!.intl;

    const calls = warn.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0]).toMatchInlineSnapshot(`
      [
        "⚠️ DEPRECATED: ServiceOptions.intl (used by test-package::test-service) in @open-pioneer/runtime (since 4.6.0, use currentIntl instead and watch for changes where appropriate) - Please update your code as this may be removed in future versions.",
      ]
    `);

    // Repeated access on the same service does not warn again
    void capturedOptions!.intl;
    expect(warn.mock.calls.length).toBe(1);

    repr.destroy();
});

it("exposes `currentIntl` as a reactive signal that returns the package intl without warning", function () {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const intl: PackageIntl = createPackageIntl("en", { greeting: "hello" });
    const intlSignal = reactive(intl);

    let capturedOptions: ServiceOptions | undefined;
    class TestService implements Service {
        constructor(options: ServiceOptions) {
            capturedOptions = options;
        }
    }

    const repr = constructService(TestService, intlSignal);

    expect(capturedOptions!.currentIntl).toBe(intlSignal);
    expect(capturedOptions!.currentIntl.value).toBe(intl);
    expect(capturedOptions!.currentIntl.value.formatMessage({ id: "greeting" })).toBe("hello");
    expect(warn.mock.calls.length).toBe(0); // No warning

    repr.destroy();
});

function constructService(
    clazz: new (options: ServiceOptions) => Service,
    intl: ReadonlyReactive<PackageIntl> = constant(createEmptyPackageIntl())
): ServiceRepr {
    const repr = new ServiceRepr({
        name: "test-service",
        packageName: "test-package",
        factory: createConstructorFactory(clazz),
        intl
    });
    repr.beforeCreate();
    repr.create({ references: {}, referencesMeta: {} });
    return repr;
}
