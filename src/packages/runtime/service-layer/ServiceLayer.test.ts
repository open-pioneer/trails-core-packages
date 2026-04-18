// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from "vitest";
import { createEmptyPackageIntl } from "../i18n";
import { defineServiceFactory, Service, ServiceFactory, ServiceOptions } from "../Service";
import { PackageRepr, PackageReprOptions } from "./PackageRepr";
import { ServiceLayer } from "./ServiceLayer";
import { Found } from "./ServiceLookup";
import { ReferenceSpec } from "./InterfaceSpec";
import {
    createConstructorFactory,
    createFunctionFactory,
    createFactoryForServiceFactory,
    ServiceRepr,
    ServiceReprOptions
} from "./ServiceRepr";

describe("service lifecycle", () => {
    it("starts and stops services in the expected order", function () {
        let events: string[] = [];

        class ServiceA implements Service {
            constructor(
                options: ServiceOptions<{
                    b: unknown;
                }>
            ) {
                if (!(options.references.b instanceof ServiceB)) {
                    throw new Error("unexpected value for service b");
                }

                events.push("construct-a");
            }

            destroy(): void {
                events.push("destroy-a");
            }
        }

        class ServiceB implements Service {
            constructor() {
                events.push("construct-b");
            }

            destroy() {
                events.push("destroy-b");
            }
        }

        const packages = [
            createPackage({
                name: "a",
                services: [
                    createService({
                        name: "A",
                        packageName: "a",
                        factory: createConstructorFactory(ServiceA),
                        interfaces: [
                            {
                                interfaceName: "a.serviceA"
                            }
                        ],
                        dependencies: [
                            {
                                referenceName: "b",
                                interfaceName: "b.serviceB"
                            }
                        ]
                    })
                ]
            }),
            createPackage({
                name: "b",
                services: [
                    createService({
                        name: "B",
                        packageName: "b",
                        factory: createConstructorFactory(ServiceB),
                        interfaces: [{ interfaceName: "b.serviceB" }]
                    })
                ]
            })
        ];
        const serviceLayer = startServiceLayer(packages, [{ interfaceName: "a.serviceA" }]);
        expect(events).toEqual(["construct-b", "construct-a"]); // dep before usage
        events = [];

        serviceLayer.destroy();
        expect(events).toEqual(["destroy-a", "destroy-b"]); // reverse order
    });

    it("destroys service providers when they are no longer used by any dependents", function () {
        const initEvents: string[] = [];
        const destroyEvents: string[] = [];

        class TestService implements Service {
            #id: string;
            #deps: TestService[] = [];
            #initialized = false;
            #destroyed = false;

            constructor({ references }: ServiceOptions, id: string, expectedDeps: string[]) {
                this.#id = id;

                for (const expected of expectedDeps) {
                    const dep = (references as any)[expected] as TestService | undefined;
                    if (!dep) {
                        throw new Error(
                            `Illegal state: service ${id} needs a reference to ${expected}.`
                        );
                    }
                    if (!dep.initialized) {
                        throw new Error(
                            `Illegal state: dependency ${dep.id} of service ${id} has not been initialized.`
                        );
                    }
                    this.#deps.push(dep);
                }

                this.#initialized = true;
                initEvents.push(id);
            }

            destroy(): void {
                if (!this.#initialized) {
                    throw new Error(`Illegal state: service ${this.id} was never initialized.`);
                }
                if (this.#destroyed) {
                    throw new Error(`Illegal state: service ${this.id} was already destroyed.`);
                }
                for (const dep of this.#deps) {
                    if (dep.destroyed) {
                        throw new Error(
                            `Illegal state: dependency ${dep.id} of ${this.id} was destroyed before the service.`
                        );
                    }
                }

                this.#destroyed = true;
                destroyEvents.push(this.id);
            }

            get id(): string {
                return this.#id;
            }

            get initialized() {
                return this.#initialized;
            }

            get destroyed() {
                return this.#destroyed;
            }
        }

        // Tests that:
        // 1. Dependencies are initialized before the service that requires them
        // 2. Services are destroyed before their dependencies (reverse order)
        // 3. Initialization and destruction happens exactly once per service
        //
        // Service dependencies:
        // App -> A -> B -> C
        //          -> C
        // App -> B ...
        const packageName = "test-package";
        const serviceC = createService({
            name: "C",
            packageName,
            factory: createFunctionFactory((opts) => new TestService(opts, "C", [])),
            interfaces: [{ interfaceName: "interface.C" }]
        });
        const serviceB = createService({
            name: "B",
            packageName,
            factory: createFunctionFactory((opts) => new TestService(opts, "B", ["c"])),
            dependencies: [{ referenceName: "c", interfaceName: "interface.C" }],
            interfaces: [{ interfaceName: "interface.B" }]
        });
        const serviceA = createService({
            name: "A",
            packageName,
            factory: createFunctionFactory((opts) => new TestService(opts, "A", ["b", "c"])),
            dependencies: [
                { referenceName: "b", interfaceName: "interface.B" },
                { referenceName: "c", interfaceName: "interface.C" }
            ],
            interfaces: [{ interfaceName: "interface.A" }]
        });

        const packages = [
            createPackage({
                name: packageName,
                services: [serviceA, serviceB, serviceC]
            })
        ];

        const serviceLayer = startServiceLayer(packages, [
            { interfaceName: "interface.A" },
            { interfaceName: "interface.B" }
            // C only required indirectly
        ]);

        // `a` must occur before `b`
        const isBefore = (events: string[], a: string, b: string) => {
            const aIdx = events.indexOf(a);
            if (aIdx < 0) {
                throw new Error(`Event ${a} not found in array`);
            }
            const bIdx = events.indexOf(b);
            if (bIdx < 0) {
                throw new Error(`Event ${b} not found in array`);
            }
            return aIdx < bIdx;
        };

        // All services were constructed
        expect(new Set(initEvents)).toEqual(new Set(["A", "B", "C"]));
        expect(isBefore(initEvents, "C", "B")).toBe(true); // B depends on C
        expect(isBefore(initEvents, "C", "A")).toBe(true); // A depends on C
        expect(isBefore(initEvents, "B", "A")).toBe(true); // A depends on B

        serviceLayer.destroy();

        // All services were destroyed
        expect(new Set(destroyEvents)).toEqual(new Set(["A", "B", "C"]));
        expect(isBefore(destroyEvents, "B", "C")).toBe(true); // B depends on C
        expect(isBefore(destroyEvents, "A", "C")).toBe(true); // A depends on C
        expect(isBefore(destroyEvents, "A", "B")).toBe(true); // A depends on B
    });
});

it("supports using a function to create service instances", function () {
    let called = 0;

    type HelloService = Service<{ hello(): string }>;

    const factory = (options: ServiceOptions): HelloService => {
        ++called;
        return {
            hello() {
                return `Hello ${options.properties.target}!`;
            }
        };
    };

    const service = createService({
        name: "A",
        packageName: "a",
        factory: createFunctionFactory(factory),
        interfaces: [
            {
                interfaceName: "foo"
            }
        ],
        properties: {
            target: "world"
        }
    });
    startServiceLayer(
        [createPackage({ name: "a", services: [service] })],
        [{ interfaceName: "foo" }]
    );
    expect(called).toBe(1);

    const instance = service.getInstanceOrThrow();
    const message = (instance as HelloService).hello();
    expect(message).toEqual("Hello world!");
});

it("supports using a service factory to create service instances", function () {
    let called: string[] = [];

    type HelloService = { hello(): string };

    class HelloServiceFactory implements ServiceFactory<HelloService> {
        constructor(private options: ServiceOptions) {
            called.push("factory.constructor");
        }
        createService() {
            called.push("factory.createService");
            const opts = this.options;
            return {
                hello() {
                    return `Hello ${opts.properties.target}!`;
                },
                destroy(): void {
                    called.push("service.destroy");
                }
            };
        }
        destroyService(_service: Service<HelloService>): void {
            called.push("factory.destroyService");
        }
        destroy(): void {
            called.push("factory.destroy");
        }
    }

    // Mark the factory with the symbol so that the runtime recognizes it as a service factory constructor
    const markedFactory = defineServiceFactory(HelloServiceFactory);

    const service = createService({
        name: "A",
        packageName: "a",
        factory: createFactoryForServiceFactory(markedFactory),
        interfaces: [
            {
                interfaceName: "foo"
            }
        ],
        properties: {
            target: "world"
        }
    });
    const serviceLayer = new ServiceLayer(
        [
            createPackage({
                name: "a",
                services: [service]
            })
        ],
        [
            {
                interfaceName: "foo"
            }
        ]
    );

    serviceLayer.start();

    expect(called).toEqual(["factory.constructor", "factory.createService"]);
    called = [];

    const instance = service.getInstanceOrThrow();
    const message = (instance as HelloService).hello();
    expect(message).toEqual("Hello world!");

    serviceLayer.destroy();

    expect(called).toEqual([
        //Should not be called by runtime: "service.destroy",
        "factory.destroyService"
    ]);
});

it("injects all implementations of an interface when requested", function () {
    interface Extension {
        readonly id: string;
    }

    const extensions: string[] = [];
    const extensionsServiceIds: string[] = [];

    class ExtensibleService {
        constructor(
            options: ServiceOptions<{
                extensions: Extension[];
            }>
        ) {
            options.references.extensions.forEach((ext) => extensions.push(ext.id));
            options.referencesMeta.extensions.forEach((meta) =>
                extensionsServiceIds.push(meta.serviceId)
            );
        }
    }

    class Ext1 implements Service<Extension> {
        id = "ext1";
    }

    class Ext2 implements Service<Extension> {
        id = "ext2";
    }

    const packages = [
        createPackage({
            name: "test",
            services: [
                createService({
                    name: "ExtensibleService",
                    packageName: "test",
                    factory: createConstructorFactory(ExtensibleService),
                    dependencies: [
                        {
                            referenceName: "extensions",
                            interfaceName: "test.Extension",
                            all: true
                        }
                    ],
                    interfaces: [
                        {
                            interfaceName: "extensible.Service"
                        }
                    ]
                }),
                createService({
                    name: "Ext1",
                    packageName: "test",
                    factory: createConstructorFactory(Ext1),
                    interfaces: [
                        {
                            interfaceName: "test.Extension",
                            qualifier: "qualifier-ext1"
                        }
                    ]
                }),
                createService({
                    name: "Ext2",
                    packageName: "test",
                    factory: createConstructorFactory(Ext2),
                    interfaces: [
                        {
                            interfaceName: "test.Extension",
                            qualifier: "qualifier-ext2"
                        }
                    ]
                })
            ]
        })
    ];
    const serviceLayer = startServiceLayer(packages, [{ interfaceName: "extensible.Service" }]);
    extensions.sort();
    extensionsServiceIds.sort();
    expect(extensions).toEqual(["ext1", "ext2"]);
    expect(extensionsServiceIds).toEqual(["test::Ext1", "test::Ext2"]);
    serviceLayer.destroy();
});

it("allows access to service instances if the dependency was declared", function () {
    class Dummy {}

    const serviceLayer = startServiceLayer([
        createPackage({
            name: "test-package",
            services: [
                createService({
                    name: "A",
                    packageName: "test-package",
                    factory: createConstructorFactory(Dummy),
                    dependencies: [],
                    interfaces: [
                        { interfaceName: "testpackage.Interface" },
                        { interfaceName: "testpackage.OtherInterface" }
                    ]
                })
            ],
            uiReferences: [{ interfaceName: "testpackage.Interface" }]
        })
    ]);

    const resultDeclared = serviceLayer.getService("test-package", {
        interfaceName: "testpackage.Interface"
    });
    expect(resultDeclared.type).toBe("found");
    expect((resultDeclared as Found<Service>).value).toBeDefined();

    const resultUndeclared = serviceLayer.getService("test-package", {
        interfaceName: "testpackage.OtherInterface"
    });
    expect(resultUndeclared.type).toBe("undeclared");

    const resultUndeclared2 = serviceLayer.getService("whatever", {
        interfaceName: "testpackage.Interface"
    });
    expect(resultUndeclared2.type, "undeclared");

    serviceLayer.destroy();
});

it("injects properties into service instances", function () {
    let properties: Record<string, unknown> | undefined;

    const service = createService({
        name: "Service",
        packageName: "pkg",
        interfaces: [{ interfaceName: "testpackage.Interface" }],
        properties: {
            foo: "bar"
        },
        factory: createConstructorFactory(
            class Service {
                constructor(options: ServiceOptions) {
                    properties = options.properties;
                }
            }
        )
    });
    const serviceLayer = startServiceLayer([
        createPackage({
            name: "test-package",
            services: [service],
            uiReferences: [{ interfaceName: "testpackage.Interface" }]
        })
    ]);

    expect(service.instance).toBeDefined();
    expect(properties).toStrictEqual({
        foo: "bar"
    });

    serviceLayer.destroy();
});

function createService(options: Partial<ServiceReprOptions>) {
    return new ServiceRepr({
        name: "test-service",
        packageName: "test-package",
        factory: createConstructorFactory(class {}),
        intl: createEmptyPackageIntl(),
        ...options
    });
}

function createPackage(options: Partial<PackageReprOptions>) {
    return new PackageRepr({
        name: "test-package",
        intl: createEmptyPackageIntl(),
        ...options
    });
}

function startServiceLayer(packages: PackageRepr[], forcedReferences?: ReferenceSpec[]) {
    const serviceLayer = new ServiceLayer(packages, forcedReferences);
    serviceLayer.start();
    return serviceLayer;
}
