// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { constant, ReadonlyReactive } from "@conterra/reactivity-core";
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

    const calls = warn.mock.calls.filter((args) => isDeprecationCall(args, "intl"));
    expect(calls.length).toBe(1);
    const [firstWarningArgument] = calls[0]!;
    const message = String(firstWarningArgument);
    expect(message).toContain("@open-pioneer/runtime");
    expect(message).toContain("currentIntl");

    // Repeated access on the same service does not warn again
    void capturedOptions!.intl;
    const callsAfter = warn.mock.calls.filter((args) => isDeprecationCall(args, "intl"));
    expect(callsAfter.length).toBe(1);

    repr.destroy();
});

it("exposes `currentIntl` as a reactive signal that returns the package intl without warning", function () {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const intl: PackageIntl = createPackageIntl("en", { greeting: "hello" });
    const intlSignal: ReadonlyReactive<PackageIntl> = constant(intl);

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

    const deprecationCalls = warn.mock.calls.filter((args) => isDeprecationCall(args, "intl"));
    expect(deprecationCalls.length).toBe(0);

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

function isDeprecationCall(args: unknown[], name: string): boolean {
    const first = args[0];
    return typeof first === "string" && first.includes("DEPRECATED") && first.includes(name);
}
