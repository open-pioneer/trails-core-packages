// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
/**
 * @vitest-environment happy-dom
 */
import { FormatNumber, mergeConfigs, SystemConfig, useChakraContext } from "@chakra-ui/react";
import { findByTestId, findByText } from "@testing-library/dom";
import { act } from "@testing-library/react";
import { ReactNode, createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PackageIntl, createEmptyI18n } from "../i18n";
import { Service, ServiceConstructor } from "../Service";
import { InterfaceSpec, ReferenceSpec } from "../service-layer/InterfaceSpec";
import { PackageRepr } from "../service-layer/PackageRepr";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { ServiceRepr, createConstructorFactory } from "../service-layer/ServiceRepr";
import { usePropertiesInternal, useServiceInternal, useServicesInternal } from "./hooks";
import { ReactIntegration } from "./ReactIntegration";

// eslint-disable-next-line import/no-relative-packages
import { UIWithProperties, UIWithService, UIWithServices } from "./test-data/test-package/UI";
import { config as defaultTrailsConfig } from "@open-pioneer/base-theme";

interface TestProvider {
    value: string;
}

beforeEach(() => {
    document.body.innerHTML = "";
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
    }).toThrowErrorMatchingInlineSnapshot(
        `[Error: runtime:undeclared-dependency: Package 'test' did not declare an UI dependency on interface 'test.InterfaceThatDoesNotExist'. Add the dependency to the package configuration or remove the usage.]`
    );
});

it("reports a helpful error when package metadata is missing", async () => {
    // This problem can happen when a package is not correctly declared as a dependency in package.json
    // (so its metadata are not discovered by the vite plugin) but it is still imported from the application
    // where it attempts to use a service.
    function TestComponent() {
        const service = useServiceInternal<unknown>("packageMissingFromMetadata", "test.Provider");
        return String(service);
    }

    const { integration } = createIntegration();
    expect(() => {
        act(() => {
            integration.render(createElement(TestComponent));
        });
    }).toThrowErrorMatchingInlineSnapshot(
        `[Error: runtime:missing-package: Package 'packageMissingFromMetadata' was not found in the application's metadata while it attempted to reference the interface 'test.Provider'. Check that the dependency is declared correctly in the packages that use 'packageMissingFromMetadata'.]`
    );
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
    }).toThrowErrorMatchingInlineSnapshot(
        `[Error: runtime:undeclared-dependency: Package 'test' did not declare an UI dependency on all services implementing interface 'test.Provider'. Add the dependency ("all": true) to the package configuration or remove the usage.]`
    );
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
    }).toThrowErrorMatchingInlineSnapshot(
        `[Error: runtime:internal-error: Package 'test' was not found in application.]`
    );
});

it("should apply the configured chakra config", async () => {
    const testConfig = mergeConfigs(defaultTrailsConfig, {
        theme: {
            semanticTokens: {
                colors: {
                    dummyColor: { value: "#123456" }
                }
            }
        }
    });
    const { integration, wrapper } = createIntegration({
        disablePackage: true,
        config: testConfig
    });

    function TestComponent(): ReactNode {
        const sys = useChakraContext();
        const dummyColorToken = sys.tokens.getByName("colors.dummyColor");
        return createElement(
            "div",
            {
                "data-testid": "test-div"
            },
            `Color: ${dummyColorToken?.value}`
        );
    }

    act(() => {
        integration.render(createElement(TestComponent));
    });

    const node = await findByTestId(wrapper, "test-div");
    expect(node.textContent).toBe("Color: #123456");
});

it("should apply the configured locale (en-US)", async () => {
    const { integration, wrapper } = createIntegration({
        disablePackage: true,
        locale: "en-US"
    });

    function TestComponent(): ReactNode {
        return createElement(FormatNumber, {
            value: 123.456
        });
    }
    act(() => {
        integration.render(createElement(TestComponent));
    });
    expect(wrapper.textContent).toEqual("123.456");
});

it("should apply the configured locale (de-DE)", async () => {
    const { integration, wrapper } = createIntegration({
        disablePackage: true,
        locale: "de-DE"
    });

    function TestComponent(): ReactNode {
        return createElement(FormatNumber, {
            value: 123.456
        });
    }
    act(() => {
        integration.render(createElement(TestComponent));
    });
    expect(wrapper.textContent).toEqual("123,456");
});

describe("integration for error screen ", function () {
    it("should create an ReactIntegration for an error screen", async () => {
        const integration = ReactIntegration.createForErrorScreen({
            appRoot: document.createElement("div"),
            rootNode: document,
            config: undefined,
            locale: "en"
        });

        expect(integration).toBeInstanceOf(ReactIntegration);
    });

    it("should throw an error when trying to access a service on an error screen", async () => {
        const integration = ReactIntegration.createForErrorScreen({
            appRoot: document.createElement("div"),
            rootNode: document,
            config: undefined,
            locale: "en"
        });

        function TestComponent() {
            const service = useServiceInternal<unknown>("test", "test.Provider") as TestProvider;
            return createElement("span", undefined, `Hello ${service.value}`);
        }

        expect(() => {
            act(() => {
                integration.render(createElement(TestComponent));
            });
        }).toThrowErrorMatchingInlineSnapshot(
            `[Error: runtime:invalid-state: Hook cannot be used within the error screen.]`
        );
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
    config?: SystemConfig | undefined;
    locale?: string;
}): TestIntegration {
    const wrapper = document.createElement("div");
    const shadowRoot = wrapper.attachShadow({ mode: "open" });

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
        rootNode: shadowRoot,
        appRoot: wrapper,
        config: options?.config,
        packages,
        serviceLayer,
        locale: options?.locale ?? "en"
    });
    return { integration, wrapper };
}
