// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
/**
 * @vitest-environment happy-dom
 */
import { findByTestId, findByText } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, expect, it, MockInstance, afterEach, vi, describe } from "vitest";
import { Service, ServiceConstructor } from "../Service";
import { usePropertiesInternal, useServiceInternal, useServicesInternal } from "./hooks";
import { PackageIntl, createEmptyI18n } from "../i18n";
import { InterfaceSpec, ReferenceSpec } from "../service-layer/InterfaceSpec";
import { PackageRepr } from "../service-layer/PackageRepr";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { ServiceRepr, createConstructorFactory } from "../service-layer/ServiceRepr";
import { ReactIntegration } from "./ReactIntegration";

// eslint-disable-next-line import/no-relative-packages
import { UIWithProperties, UIWithService, UIWithServices } from "./test-data/test-package/UI";

interface TestProvider {
    value: string;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

let errorSpy!: MockInstance;
beforeEach(() => {
    errorSpy = vi.spyOn(console, "error");
});

afterEach(() => {
    vi.restoreAllMocks();
});

it("should allow access to service via react hook", async () => {
    function TestComponent() {
        const service = useServiceInternal<unknown>("test", "test.Provider") as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { wrapper, integration } = createIntegration({
        packageUiReferences: [{ interfaceName: "test.Provider" }],
        services: [
            {
                name: "Provider",
                interfaces: [{ interfaceName: "test.Provider" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST";
                }
            }
        ]
    });

    act(() => {
        integration.render(createElement(TestComponent));
    });

    const node = await findByText(wrapper, "Hello TEST");
    expect(node).toMatchSnapshot();
});

it("should get error when using undefined service", async () => {
    errorSpy.mockImplementation(doNothing);

    function TestComponent() {
        const service = useServiceInternal<unknown>(
            "test",
            "test.InterfaceThatDoesNotExist"
        ) as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { integration } = createIntegration();

    expect(() => {
        act(() => {
            integration.render(createElement(TestComponent));
        });
    }).toThrowErrorMatchingSnapshot();
    expect(errorSpy).toHaveBeenCalledOnce();
});

it("reports a helpful error when package metadata is missing", async () => {
    // This problem can happen when a package is not correctly declared as a dependency in package.json
    // (so its metadata are not discovered by the vite plugin) but it is still imported from the application
    // where it attempts to use a service.
    errorSpy.mockImplementation(doNothing);

    function TestComponent() {
        const service = useServiceInternal<unknown>("packageMissingFromMetadata", "test.Provider");
        return String(service);
    }

    const { integration } = createIntegration();
    expect(() => {
        act(() => {
            integration.render(createElement(TestComponent));
        });
    }).toThrowErrorMatchingSnapshot();
    expect(errorSpy).toHaveBeenCalledOnce();
});

it("should allow access to service with qualifier via react hook", async () => {
    function TestComponent() {
        const service = useServiceInternal<unknown>("test", "test.Provider", {
            qualifier: "foo"
        }) as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { wrapper, integration } = createIntegration({
        services: [
            {
                name: "Provider",
                interfaces: [{ interfaceName: "test.Provider", qualifier: "foo" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST";
                }
            }
        ],
        packageUiReferences: [{ interfaceName: "test.Provider", qualifier: "foo" }]
    });

    act(() => {
        integration.render(createElement(TestComponent));
    });

    const node = await findByText(wrapper, "Hello TEST");
    expect(node).toMatchSnapshot();
});

it("should deny access to service when the qualifier does not match", async () => {
    errorSpy.mockImplementation(doNothing);

    function TestComponent() {
        const service = useServiceInternal<unknown>("test", "test.Provider", {
            qualifier: "bar"
        }) as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { integration } = createIntegration({
        services: [
            {
                name: "Provider",
                interfaces: [{ interfaceName: "test.Provider", qualifier: "foo" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST";
                }
            }
        ],
        packageUiReferences: [{ interfaceName: "test.Provider", qualifier: "foo" }]
    });

    expect(() => {
        act(() => {
            integration.render(createElement(TestComponent));
        });
    }).toThrowErrorMatchingSnapshot();
    expect(errorSpy).toHaveBeenCalledOnce();
});

it("should allow access to all services via react hook", async () => {
    function TestComponent() {
        const services = useServicesInternal<unknown>("test", "test.Provider") as TestProvider[];
        return createElement(
            "span",
            undefined,
            `Joined Values: ${services.map((s) => s.value).join()}`
        );
    }

    const { wrapper, integration } = createIntegration({
        services: [
            {
                name: "Provider1",
                interfaces: [{ interfaceName: "test.Provider", qualifier: "foo" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST1";
                }
            },
            {
                name: "Provider2",
                interfaces: [{ interfaceName: "test.Provider", qualifier: "bar" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST2";
                }
            },
            {
                name: "Provider3",
                interfaces: [{ interfaceName: "test.Provider", qualifier: "baz" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST3";
                }
            }
        ],
        packageUiReferences: [{ interfaceName: "test.Provider", all: true }]
    });

    act(() => {
        integration.render(createElement(TestComponent));
    });

    const node = await findByText(wrapper, /^Joined Values:/);
    expect(node).toMatchSnapshot();
});

it("should deny access to all services if declaration is missing", async () => {
    errorSpy.mockImplementation(doNothing);

    function TestComponent() {
        const services = useServicesInternal<unknown>("test", "test.Provider") as TestProvider[];
        return createElement(
            "span",
            undefined,
            `Joined Values: ${services.map((s) => s.value).join()}`
        );
    }

    const { integration } = createIntegration({
        services: []
    });

    expect(() => {
        act(() => {
            integration.render(createElement(TestComponent));
        });
    }).toThrowErrorMatchingSnapshot();
    expect(errorSpy).toHaveBeenCalledOnce();
});

it("should be able to read properties from react component", async () => {
    function TestComponent() {
        const properties = usePropertiesInternal("test");
        return createElement("span", undefined, `Hello ${properties.name}`);
    }

    const { wrapper, integration } = createIntegration({
        packageProperties: {
            name: "USER"
        }
    });

    act(() => {
        integration.render(createElement(TestComponent));
    });

    const node = await findByText(wrapper, "Hello USER");
    expect(node).toMatchSnapshot();
});

it("should provide the autogenerated useService hook", async () => {
    const testPackageName = "@open-pioneer/runtime__react_test_package";
    const { wrapper, integration } = createIntegration({
        packageName: testPackageName,
        packageUiReferences: [{ interfaceName: "test.Provider" }],
        services: [
            {
                name: "Provider",
                interfaces: [{ interfaceName: "test.Provider" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST";
                }
            }
        ]
    });

    act(() => {
        integration.render(createElement(UIWithService));
    });

    const node = await findByText(wrapper, /^Test-UI:/);
    expect(node).toMatchSnapshot();
});

it("should provide the autogenerated useServices hook", async () => {
    const testPackageName = "@open-pioneer/runtime__react_test_package";
    const { wrapper, integration } = createIntegration({
        packageName: testPackageName,
        packageUiReferences: [{ interfaceName: "test.Provider", all: true }],
        services: [
            {
                name: "Provider1",
                interfaces: [{ interfaceName: "test.Provider" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST1";
                }
            },
            {
                name: "Provider2",
                interfaces: [{ interfaceName: "test.Provider" }],
                clazz: class Provider implements Service<TestProvider> {
                    value = "TEST2";
                }
            }
        ]
    });

    act(() => {
        integration.render(createElement(UIWithServices));
    });

    const node = await findByText(wrapper, /^Test-UI:/);
    expect(node).toMatchSnapshot();
});

it("should provide the autogenerated useProperties hook", async () => {
    const testPackageName = "@open-pioneer/runtime__react_test_package";
    const { wrapper, integration } = createIntegration({
        packageName: testPackageName,
        packageProperties: {
            greeting: "Hello World!"
        }
    });

    act(() => {
        integration.render(createElement(UIWithProperties));
    });

    const node = await findByText(wrapper, /^Test-UI:/);
    expect(node).toMatchSnapshot();
});

it("should throw error when requesting properties from an unknown package", async () => {
    errorSpy.mockImplementation(doNothing);

    const { integration } = createIntegration({
        disablePackage: true
    });

    function TestComponent() {
        const properties = usePropertiesInternal("test");
        return createElement("span", undefined, `Hello ${properties.name}`);
    }

    expect(() => {
        act(() => {
            integration.render(createElement(TestComponent));
        });
    }).toThrowErrorMatchingSnapshot();
    expect(errorSpy).toHaveBeenCalledOnce();
});

it("should apply the configured chakra theme", async () => {
    const testTheme = {
        colors: {
            dummyColor: "#123456"
        }
    };
    const { integration, wrapper } = createIntegration({
        disablePackage: true,
        theme: testTheme
    });

    function TestComponent() {
        // TODO
        throw new Error("not implemented");
    }

    act(() => {
        integration.render(createElement(TestComponent));
    });

    const node = await findByTestId(wrapper, "test-div");
    expect(node.textContent).toBe("Color: #123456");
});

describe("integration for error screen ", function () {
    it("should create an ReactIntegration for an error screen", async () => {
        const integration = ReactIntegration.createForErrorScreen({
            appRoot: document.createElement("div"),
            rootNode: document.createElement("div"),
            theme: undefined
        });

        expect(integration).toBeInstanceOf(ReactIntegration);
    });

    it("should throw an error when trying to access a service on an error screen", async () => {
        errorSpy.mockImplementation(doNothing);

        const integration = ReactIntegration.createForErrorScreen({
            appRoot: document.createElement("div"),
            rootNode: document.createElement("div"),
            theme: undefined
        });

        function TestComponent() {
            const service = useServiceInternal<unknown>("test", "test.Provider") as TestProvider;
            return createElement("span", undefined, `Hello ${service.value}`);
        }

        expect(() => {
            act(() => {
                integration.render(createElement(TestComponent));
            });
        }).toThrowErrorMatchingSnapshot();
        expect(errorSpy).toHaveBeenCalledOnce();
    });
});

interface ServiceSpec {
    name: string;
    interfaces: InterfaceSpec[];
    clazz: ServiceConstructor;
}

export interface TestIntegration {
    wrapper: HTMLDivElement;
    integration: ReactIntegration;
}

function createIntegration(options?: {
    disablePackage?: boolean;
    packageName?: string;
    packageProperties?: Record<string, unknown>;
    packageUiReferences?: ReferenceSpec[];
    i18n?: PackageIntl;
    services?: ServiceSpec[];
    theme?: Record<string, unknown>;
}): TestIntegration {
    const wrapper = document.createElement("div");
    const packages = new Map<string, PackageRepr>();
    const i18n = options?.i18n ?? createEmptyI18n();
    if (!options?.disablePackage) {
        const packageName = options?.packageName ?? "test";
        const services =
            options?.services?.map((spec) => {
                return new ServiceRepr({
                    name: spec.name,
                    packageName,
                    interfaces: spec.interfaces,
                    factory: createConstructorFactory(spec.clazz),
                    intl: i18n
                });
            }) ?? [];
        packages.set(
            packageName,
            new PackageRepr({
                name: packageName,
                intl: i18n,
                properties: options?.packageProperties,
                uiReferences: options?.packageUiReferences,
                services
            })
        );
    }

    const serviceLayer = new ServiceLayer(Array.from(packages.values()));
    serviceLayer.start();

    const integration = ReactIntegration.createForApp({
        rootNode: wrapper,
        appRoot: wrapper,
        theme: options?.theme,
        packages,
        serviceLayer
    });
    return { integration, wrapper };
}

function doNothing() {}
