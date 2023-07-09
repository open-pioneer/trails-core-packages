// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
/**
 * @vitest-environment jsdom
 */
import { createElement } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { usePropertiesInternal, useServiceInternal, useServicesInternal } from "./hooks";
import { findByText, waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { Service, ServiceConstructor } from "../Service";
// eslint-disable-next-line import/no-relative-packages
import { UIWithProperties, UIWithService, UIWithServices } from "./test-data/test-package/UI";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { ReactIntegration } from "./ReactIntegration";
import { PackageRepr } from "../service-layer/PackageRepr";
import { createConstructorFactory, ServiceRepr } from "../service-layer/ServiceRepr";
import { InterfaceSpec, ReferenceSpec } from "../service-layer/InterfaceSpec";
import { createEmptyI18n, PackageIntl } from "../i18n";
import { createPackageContext } from "./createPackageContext";

interface TestProvider {
    value: string;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

beforeAll(() => {
    // Silence "uncaught error" logs from (intentional) errors in react components.
    vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterAll(() => {
    vi.resetAllMocks();
});

it("should allow access to service via react hook", async () => {
    function TestComponent() {
        const service = useServiceInternal("test", "test.Provider") as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
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

    await act(() => {
        integration.render({
            type: "ready",
            Component: TestComponent,
            packageContext
        });
    });

    const node = await findByText(wrapper, "Hello TEST");
    expect(node).toMatchSnapshot();
});

it("should get error when using undefined service", async () => {
    function TestComponent() {
        const service = useServiceInternal("test", "test.Provider") as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { integration } = createIntegration();
    const packageContext = createContext({
        disablePackage: true
    });

    expect(() => {
        act(() => {
            integration.render({
                type: "ready",
                Component: TestComponent,
                packageContext
            });
        });
    }).toThrowErrorMatchingSnapshot();
});

it("should allow access to service with qualifier via react hook", async () => {
    function TestComponent() {
        const service = useServiceInternal("test", "test.Provider", {
            qualifier: "foo"
        }) as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
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
        integration.render({
            type: "ready",
            Component: TestComponent,
            packageContext
        });
    });

    const node = await findByText(wrapper, "Hello TEST");
    expect(node).toMatchSnapshot();
});

it("should deny access to service when the qualifier does not match", async () => {
    function TestComponent() {
        const service = useServiceInternal("test", "test.Provider", {
            qualifier: "bar"
        }) as TestProvider;
        return createElement("span", undefined, `Hello ${service.value}`);
    }

    const { integration } = createIntegration();
    const packageContext = createContext({
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
            integration.render({
                type: "ready",
                Component: TestComponent,
                packageContext
            });
        });
    }).toThrowErrorMatchingSnapshot();
});

it("should allow access to all services via react hook", async () => {
    function TestComponent() {
        const services = useServicesInternal("test", "test.Provider") as TestProvider[];
        return createElement(
            "span",
            undefined,
            `Joined Values: ${services.map((s) => s.value).join()}`
        );
    }

    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
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
        integration.render({
            type: "ready",
            Component: TestComponent,
            packageContext
        });
    });

    const node = await findByText(wrapper, /^Joined Values:/);
    expect(node).toMatchSnapshot();
});

it("should deny access to all services if declaration is missing", async () => {
    function TestComponent() {
        const services = useServicesInternal("test", "test.Provider") as TestProvider[];
        return createElement(
            "span",
            undefined,
            `Joined Values: ${services.map((s) => s.value).join()}`
        );
    }

    const { integration } = createIntegration();
    const packageContext = createContext({
        services: []
    });

    expect(() => {
        act(() => {
            integration.render({
                type: "ready",
                Component: TestComponent,
                packageContext
            });
        });
    }).toThrowErrorMatchingSnapshot();
});

it("should be able to read properties from react component", async () => {
    function TestComponent() {
        const properties = usePropertiesInternal("test");
        return createElement("span", undefined, `Hello ${properties.name}`);
    }

    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
        packageProperties: {
            name: "USER"
        }
    });

    act(() => {
        integration.render({
            type: "ready",
            Component: TestComponent,
            packageContext
        });
    });

    const node = await findByText(wrapper, "Hello USER");
    expect(node).toMatchSnapshot();
});

it("should provide the autogenerated useService hook", async () => {
    const testPackageName = "@open-pioneer/runtime__react_test_package";
    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
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
        integration.render({
            type: "ready",
            Component: UIWithService,
            packageContext
        });
    });

    const node = await findByText(wrapper, /^Test-UI:/);
    expect(node).toMatchSnapshot();
});

it("should provide the autogenerated useServices hook", async () => {
    const testPackageName = "@open-pioneer/runtime__react_test_package";
    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
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
        integration.render({
            type: "ready",
            Component: UIWithServices,
            packageContext
        });
    });

    const node = await findByText(wrapper, /^Test-UI:/);
    expect(node).toMatchSnapshot();
});

it("should provide the autogenerated useProperties hook", async () => {
    const testPackageName = "@open-pioneer/runtime__react_test_package";
    const { wrapper, integration } = createIntegration();
    const packageContext = createContext({
        packageName: testPackageName,
        packageProperties: {
            greeting: "Hello World!"
        }
    });

    act(() => {
        integration.render({
            type: "ready",
            Component: UIWithProperties,
            packageContext
        });
    });

    const node = await findByText(wrapper, /^Test-UI:/);
    expect(node).toMatchSnapshot();
});

it("should throw error when requesting properties from an unknown package", async () => {
    const { integration } = createIntegration();
    const packageContext = createContext({
        disablePackage: true
    });

    function TestComponent() {
        const properties = usePropertiesInternal("test");
        return createElement("span", undefined, `Hello ${properties.name}`);
    }

    expect(() => {
        act(() => {
            integration.render({
                type: "ready",
                Component: TestComponent,
                packageContext
            });
        });
    }).toThrowErrorMatchingSnapshot();
});

it("should render application errors", async () => {
    const { wrapper, integration } = createIntegration();

    const error = new Error("help!");
    error.stack = "stable\nstack\nwithout\npaths\n";

    act(() => {
        integration.render({
            type: "error",
            error
        });
    });

    const node = await waitFor(() => {
        const node = wrapper.querySelector(".error-ui");
        if (!node) {
            throw new Error("Failed to find error ui");
        }
        return node;
    });
    expect(node).toMatchSnapshot();
});

it("should render react errors if the error handler is enabled", async () => {
    const { wrapper, integration } = createIntegration({
        enableErrorHandler: true
    });
    const packageContext = createContext({
        disablePackage: true
    });

    act(() => {
        integration.render({
            type: "ready",
            Component() {
                throw new Error("error from react");
            },
            packageContext
        });
    });

    const node = await waitFor(() => {
        const node = wrapper.querySelector(".error-details");
        if (!node) {
            throw new Error("Failed to find error details");
        }
        return node;
    });

    // Not testing full text because it also contains local paths in the error stack
    expect(node.textContent).include("error from react");
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

function createIntegration(options?: { enableErrorHandler?: boolean }): TestIntegration {
    const wrapper = document.createElement("div");
    const integration = new ReactIntegration({
        rootNode: wrapper,
        containerNode: wrapper,
        enableErrorHandler: options?.enableErrorHandler ?? false
    });
    return { integration, wrapper };
}

function createContext(options?: {
    disablePackage?: boolean;
    packageName?: string;
    packageProperties?: Record<string, unknown>;
    packageUiReferences?: ReferenceSpec[];
    i18n?: PackageIntl;
    services?: ServiceSpec[];
}) {
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

    return createPackageContext(packages, serviceLayer);
}
