// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { useChakraContext } from "@chakra-ui/react";
import { screen, render } from "@testing-library/react";
import { useIntl, useProperties, useService, useServices } from "open-pioneer:react-hooks";
import { expect, it } from "vitest";
import { PackageContextProvider, PackageContextProviderProps } from "./react";

it("should allow injection of service from the test", async () => {
    function Component() {
        const service = useService("testService") as any;
        return <div>Message: {service.getMessage()}</div>;
    }

    const mocks: PackageContextProviderProps = {
        services: {
            testService: {
                getMessage() {
                    return "Hello World!";
                }
            }
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <Component />
        </PackageContextProvider>
    );

    const div = await screen.findByText(/^Message:/);
    expect(div).toMatchSnapshot();
});

it("should allow injection of service with qualifier from the test", async () => {
    function Component() {
        const service = useService("testService", { qualifier: "foo" }) as any;
        return <div>Message: {service.getMessage()}</div>;
    }

    const mocks: PackageContextProviderProps = {
        qualifiedServices: {
            testService: {
                foo: {
                    getMessage() {
                        return "Hello from service with qualifier!";
                    }
                }
            }
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <Component />
        </PackageContextProvider>
    );

    const div = await screen.findByText(/^Message:/);
    expect(div).toMatchSnapshot();
});

it("should allow injection of all service implementations from the test", async () => {
    function Component() {
        const services = useServices("testService") as any[];
        const messages = services.map((service, index) => (
            // oxlint-disable-next-line react/no-array-index-key
            <li key={index}>{service.getMessage()}</li>
        ));
        return (
            <div>
                Messages:
                <ul>{messages}</ul>
            </div>
        );
    }

    const mocks: PackageContextProviderProps = {
        services: {
            testService: {
                getMessage() {
                    return "Hello World!";
                }
            }
        },
        qualifiedServices: {
            testService: {
                foo: {
                    getMessage() {
                        return "Hello from service with qualifier=foo!";
                    }
                },
                bar: {
                    getMessage() {
                        return "Hello from service with qualifier=bar!";
                    }
                }
            }
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <Component />
        </PackageContextProvider>
    );

    const div = await screen.findByText(/^Messages:/);
    expect(div).toMatchSnapshot();
});

it("should allow injection of properties from the test", async () => {
    function Component() {
        const properties = useProperties();
        return <div>{properties.message as string}</div>;
    }

    const mocks: PackageContextProviderProps = {
        properties: {
            "@open-pioneer/test-utils": {
                message: "Hello World!"
            }
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <Component />
        </PackageContextProvider>
    );

    const div = await screen.findByText("Hello World!");
    expect(div.tagName).toBe("DIV");
});

it("should allow injection of i18n messages from the test", async () => {
    function Component() {
        const intl = useIntl();
        return <div>Message: {intl.formatMessage({ id: "message" })}</div>;
    }

    const mocks: PackageContextProviderProps = {
        messages: {
            "@open-pioneer/test-utils": {
                message: "Hello World!"
            }
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <Component />
        </PackageContextProvider>
    );

    const div = await screen.findByText(/^Message:/);
    expect(div.textContent).toBe("Message: Hello World!");
    expect(div.tagName).toBe("DIV");
});

it("should apply .pioneer-root class on the body (needed for the chakra theme to be applied correctly)", async () => {
    function Component() {
        return "hi";
    }

    render(
        <PackageContextProvider>
            <Component />
        </PackageContextProvider>
    );

    expect(document.body.classList.contains("pioneer-root")).toBe(true);
});

it("should apply a custom chakra system config from the test", async () => {
    function Component() {
        const system = useChakraContext();
        const token = system.tokens.getByName("colors.dummyColor");
        return <div>Color: {token?.value}</div>;
    }

    const mocks: PackageContextProviderProps = {
        chakraSystemConfig: {
            theme: {
                semanticTokens: {
                    colors: {
                        dummyColor: { value: "#123456" }
                    }
                }
            }
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <Component />
        </PackageContextProvider>
    );

    const div = await screen.findByText(/^Color:/);
    expect(div.textContent).toBe("Color: #123456");
});
