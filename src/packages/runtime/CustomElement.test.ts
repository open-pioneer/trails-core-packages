// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/**
 * @vitest-environment happy-dom
 */
import { isAbortError } from "@open-pioneer/core";
import {
    defineComponent,
    renderComponent,
    renderComponentShadowDOM
} from "@open-pioneer/test-utils/web-components";
import { findByTestId, waitFor } from "@testing-library/dom";
import { createElement } from "react";
import { expect, it, describe, vi, afterEach } from "vitest";
import { ApiExtension, ApiMethods, ApplicationContext, ApplicationLifecycleListener } from "./api";
import {
    ApplicationElement,
    ApplicationElementConstructor,
    createCustomElement,
    CustomElementOptions
} from "./CustomElement";
import { createBox } from "./metadata";
import { usePropertiesInternal } from "./react-integration";
import { ServiceOptions } from "./Service";
import { expectAsyncError } from "./test-utils/expectError";
import { Portal } from "@chakra-ui/react";

/** Hidden properties available during development / testing */
interface InternalElementType extends ApplicationElement {
    $inspectElementState?(): any;
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("simple rendering", function () {
    const SIMPLE_STYLE = ".test { color: red }";
    const SIMPLE_ELEM = createCustomElement({
        component: () => createElement("div", { className: "test" }, "hello world"),
        appMetadata: {
            styles: createBox(SIMPLE_STYLE)
        }
    });
    customElements.define("simple-elem", SIMPLE_ELEM);

    it("should return html element", () => {
        expect(new SIMPLE_ELEM()).toBeInstanceOf(HTMLElement);
    });

    it("should render html", async () => {
        const { queries } = await renderComponentShadowDOM("simple-elem");
        const div = await queries.findByText("hello world");
        expect(div.className).toBe("test");
    });

    it("should render user styles", async () => {
        const { shadowRoot } = await renderComponentShadowDOM("simple-elem");

        const styles = await waitFor(() => {
            const styles = shadowRoot.querySelectorAll("style");
            if (styles.length === 0) {
                throw new Error("No styles found");
            }
            return Array.from(styles);
        });

        const trailsStyles = styles.filter((styleNode) => {
            return (
                styleNode.innerHTML.includes("all:initial") ||
                styleNode.innerHTML.includes(".test{")
            );
        });
        expect(trailsStyles).toMatchInlineSnapshot(`
          [
            <style
              data-emotion="css-global"
              data-s=""
            >
              
              @layer base{:host{all:initial;display:block;}}
            </style>,
            <style
              data-emotion="css-global"
              data-s=""
            >
              
              .test{color:red;}
            </style>,
          ]
        `);
    });

    it("should clean up its content when removed from the dom", async () => {
        const { node, shadowRoot, innerContainer } = await renderComponentShadowDOM("simple-elem");
        node.remove();

        // Wait until divs are gone
        await waitFor(() => {
            const div = innerContainer.querySelector("div");
            if (div) {
                throw new Error("content still not destroyed");
            }
        });

        expect(shadowRoot.innerHTML).toBe("");
    });
});

it("uses mode 'open' for the internal shadow root", async () => {
    function TestComponent() {
        return createElement("span", undefined, "Hello World");
    }

    const elem = createCustomElement({
        component: TestComponent
    });
    const { node } = await renderComponent(elem);
    expect(node.shadowRoot).toBeTruthy();
});

it("allows customization of package properties", async () => {
    const elem = createCustomElement({
        component: function TestComponent() {
            const properties = usePropertiesInternal("test");
            return createElement("span", undefined, properties.greeting as string);
        },
        appMetadata: {
            packages: {
                test: {
                    name: "test",
                    properties: {
                        greeting: {
                            value: "Hello World"
                        }
                    }
                }
            }
        },
        config: {
            properties: {
                test: {
                    greeting: "Hello User"
                }
            }
        }
    });

    const { queries } = await renderComponentShadowDOM(elem);
    const span = await queries.findByText("Hello User");
    expect(span.tagName).toBe("SPAN");
});

it("allows customization of package properties through a callback", async () => {
    const elem = createCustomElement({
        component: function TestComponent() {
            const properties = usePropertiesInternal("test");
            return createElement("span", undefined, properties.greeting as string);
        },
        appMetadata: {
            packages: {
                test: {
                    name: "test",
                    properties: {
                        greeting: {
                            value: "Hello World"
                        }
                    }
                }
            }
        },
        config: {
            properties: {
                test: {
                    greeting: "Hello User"
                }
            }
        },
        // properties from this callback take precedence
        async resolveConfig() {
            return {
                properties: {
                    test: {
                        greeting: "Bye User"
                    }
                }
            };
        }
    });

    const { queries } = await renderComponentShadowDOM(elem);
    const span = await queries.findByText("Bye User");
    expect(span.tagName).toBe("SPAN");
});

describe("application context", () => {
    it("reports the shadow dom if enabled", async () => {
        const { element, getNodes } = getNodesHelper(true);

        const {
            node: actualHostElement,
            shadowRoot: actualShadowRoot,
            innerContainer: actualContainer
        } = await renderComponentShadowDOM(element);

        const nodes = getNodes();
        expect(nodes.hostElement).toBe(actualHostElement);
        expect(nodes.shadowRoot).toBe(actualShadowRoot);
        expect(nodes.rootNode).toBe(actualShadowRoot);
        expect(nodes.container).toBe(actualContainer);
    });

    it("reports the document if shadow root is disabled", async () => {
        const { element, getNodes } = getNodesHelper(false);

        const { node: actualHostElement, innerContainer: actualContainer } =
            await renderComponentWithoutShadowRoot(element);

        const nodes = getNodes();
        expect(nodes.hostElement).toBe(actualHostElement);
        expect(nodes.shadowRoot).toBe(undefined);
        expect(nodes.rootNode).toBe(document);
        expect(nodes.container).toBe(actualContainer);
    });

    function getNodesHelper(enableShadowRoot: boolean) {
        let hostElement: HTMLElement | undefined;
        let rootNode: Document | ShadowRoot | undefined;
        let shadowRoot: ShadowRoot | undefined;
        let container: HTMLElement | undefined;

        class TestService {
            constructor(options: ServiceOptions<{ ctx: ApplicationContext }>) {
                const ctx = options.references.ctx;
                hostElement = ctx.getHostElement();
                rootNode = ctx.getRoot();
                shadowRoot = ctx.getShadowRoot();
                container = ctx.getApplicationContainer();
            }
        }

        const element = createCustomElement({
            advanced: {
                enableShadowRoot
            },
            appMetadata: {
                packages: {
                    test: {
                        name: "test",
                        services: {
                            testService: {
                                name: "testService",
                                clazz: TestService,
                                references: {
                                    ctx: {
                                        name: "runtime.ApplicationContext"
                                    }
                                },
                                provides: [
                                    {
                                        name: "runtime.AutoStart"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        });

        return {
            element,
            getNodes() {
                return {
                    hostElement,
                    rootNode,
                    shadowRoot,
                    container
                };
            }
        };
    }
});

describe("element API", () => {
    it("should throw an error when trying to use the element's API without mounting it first", async () => {
        const elem = createCustomElement({});
        const tag = defineComponent(elem);
        const node = document.createElement(tag) as ApplicationElement;
        const error = await expectAsyncError(() => node.when());
        expect(error).toMatchSnapshot();
    });

    it("should provide an empty API by default", async () => {
        const elem = createCustomElement({});
        const { node } = await renderComponent(elem);
        const api = await (node as ApplicationElement).when();
        expect(api).toEqual({});
    });

    it("throws an error when the component is unmounted while waiting for the API", async function () {
        const elem = createCustomElement({});
        const tag = defineComponent(elem);
        const node = document.createElement(tag) as ApplicationElement;
        document.body.appendChild(node);

        const err = expectAsyncError(() => node.when());
        node.remove();

        const error = await err;
        expect(isAbortError(error)).toBe(true);
    });

    it("should allow services to provide an API", async () => {
        const events: string[] = [];
        class Extension implements ApiExtension {
            async getApiMethods(): Promise<ApiMethods> {
                return {
                    add(x: number, y: number) {
                        events.push("add");
                        return x + y;
                    },
                    otherMethod() {
                        events.push("otherMethod");
                    }
                };
            }
        }

        const elem = createCustomElement({
            appMetadata: {
                packages: {
                    test: {
                        name: "test",
                        services: {
                            testService: {
                                name: "testService",
                                provides: [
                                    {
                                        name: "integration.ApiExtension"
                                    }
                                ],
                                clazz: Extension
                            }
                        }
                    }
                }
            }
        });

        const { node } = await renderComponent(elem);
        const api = await (node as ApplicationElement).when();
        expect(Object.keys(api).sort()).toEqual(["add", "otherMethod"]);
        expect(events).toEqual([]);

        const sum = api.add!(3, 4);
        expect(sum).toEqual(7);
        expect(events).toEqual(["add"]);

        api.otherMethod!();
        expect(events).toEqual(["add", "otherMethod"]);
    });
});

describe("application lifecycle events", function () {
    it("signals 'after-start' and 'before-stop' events", async function () {
        const events: string[] = [];
        class Listener implements ApplicationLifecycleListener {
            afterApplicationStart() {
                events.push("start");
            }

            beforeApplicationStop() {
                events.push("stop");
            }
        }

        const elem = createCustomElement({
            appMetadata: {
                packages: {
                    test: {
                        name: "test",
                        services: {
                            Listener: {
                                name: "Listener",
                                provides: [
                                    {
                                        name: "runtime.ApplicationLifecycleListener"
                                    }
                                ],
                                clazz: Listener
                            }
                        }
                    }
                }
            }
        });

        const { node, innerContainer } = await renderComponentShadowDOM(elem);
        expect(events).toEqual(["start"]);

        // Wait until divs are gone
        node.remove();
        await waitFor(() => {
            const div = innerContainer.querySelector("div");
            if (div) {
                throw new Error("content still not destroyed");
            }
        });

        expect(events).toEqual(["start", "stop"]);
    });

    it("does not signal 'before-stop' when start fails", async function () {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const events: string[] = [];
        class Listener implements ApplicationLifecycleListener {
            afterApplicationStart() {
                events.push("start");
            }

            beforeApplicationStop() {
                events.push("stop");
            }
        }

        const elem = createCustomElement({
            async resolveConfig() {
                throw new Error("help!");
            },
            appMetadata: {
                packages: {
                    test: {
                        name: "test",
                        services: {
                            Listener: {
                                name: "Listener",
                                provides: [
                                    {
                                        name: "runtime.ApplicationLifecycleListener"
                                    }
                                ],
                                clazz: Listener
                            }
                        }
                    }
                }
            }
        });

        // App starts up and immediately stops because of the error in `resolveConfig` above.
        const { node } = await renderComponent(elem);
        await waitFor(() => {
            const state = (node as InternalElementType).$inspectElementState?.().state;
            if (state !== "error") {
                throw new Error(`App did not reach destroyed state.`);
            }
        });

        expect(events).toEqual([]);
        expect(errorSpy).toMatchInlineSnapshot(`
          [MockFunction error] {
            "calls": [
              [
                "#1",
                [Error: help!],
              ],
              [
                "#2",
                [Error: runtime:config-resolution-failed: Failed to resolve application properties.],
              ],
            ],
            "results": [
              {
                "type": "return",
                "value": undefined,
              },
              {
                "type": "return",
                "value": undefined,
              },
            ],
          }
        `);
    });
});

describe("service autostart", function () {
    it("starts all services implementing the AutoStart interface", async function () {
        const events: string[] = [];
        class ListenerA {
            constructor() {
                events.push("A");
            }
        }
        class ListenerB {
            constructor() {
                events.push("B");
            }
        }

        const elem = createCustomElement({
            appMetadata: {
                packages: {
                    test: {
                        name: "test",
                        services: {
                            ListenerA: {
                                name: "ListenerA",
                                provides: [
                                    {
                                        name: "runtime.AutoStart"
                                    }
                                ],
                                clazz: ListenerA
                            },
                            ListenerB: {
                                name: "ListenerB",
                                provides: [
                                    {
                                        name: "runtime.AutoStart"
                                    }
                                ],
                                clazz: ListenerB
                            }
                        }
                    }
                }
            }
        });

        await renderComponentShadowDOM(elem);
        events.sort();
        expect(events).toEqual(["A", "B"]);
    });
});

describe("i18n support", function () {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("chooses locale from the supported browser locales (german)", async () => {
        const spy = vi.spyOn(window.navigator, "languages", "get");
        spy.mockReturnValue(["de-DE", "de", "en"]);

        const api = await launchApp();
        const { locale, message } = await api.getLocaleInfo();
        expect(locale).toBe("de-DE");
        expect(message).toBe("Hallo Welt");
    });

    it("chooses locale from the supported browser locales (english)", async () => {
        const spy = vi.spyOn(window.navigator, "languages", "get");
        spy.mockReturnValue(["en-US", "en"]);

        const api = await launchApp();
        const { locale, message } = await api.getLocaleInfo();
        expect(locale).toBe("en-US");
        expect(message).toBe("Hello world");
    });

    it("supports forcing to a specific locale", async () => {
        const spy = vi.spyOn(window.navigator, "languages", "get");
        spy.mockReturnValue(["en-US", "en"]);

        const api = await launchApp({
            config: {
                locale: "de-simple"
            }
        });
        const { locale, message } = await api.getLocaleInfo();
        expect(locale).toBe("de-simple");
        expect(message).toBe("Hallo Welt (einfach)");
    });

    it("supports forcing to a specific locale with resolveConfig()", async () => {
        const spy = vi.spyOn(window.navigator, "languages", "get");
        spy.mockReturnValue(["en-US", "en"]);

        const api = await launchApp({
            config: {
                locale: "en" // overwritten by resolveConfig
            },
            resolveConfig() {
                return Promise.resolve({
                    locale: "de-simple"
                });
            }
        });
        const { locale, message } = await api.getLocaleInfo();
        expect(locale).toBe("de-simple");
        expect(message).toBe("Hallo Welt (einfach)");
    });

    it("supports restarting with a different locale", async () => {
        // Hide i18n warnings
        vi.spyOn(console, "warn").mockImplementation(() => undefined);

        const spy = vi.spyOn(window.navigator, "languages", "get");
        spy.mockReturnValue(["en-US", "en"]);

        const api = await launchApp({
            config: {
                locale: "en-US"
            }
        });
        const { locale, message, supportedLocales } = await api.getLocaleInfo();
        expect(locale).toBe("en-US");
        expect(message).toBe("Hello world");
        expect(supportedLocales).toMatchInlineSnapshot(`
          [
            "de",
            "en",
            "de-simple",
          ]
        `);

        // Changes locale and has priority over the `config` above
        await api.setLocale("de-DE");
        await waitFor(async () => {
            const { locale } = await api.getLocaleInfo();
            if (locale !== "de-DE") {
                throw new Error("locale not changed yet");
            }
        });
        const { locale: newLocale, message: newMessage } = await api.getLocaleInfo();
        expect(newLocale).toBe("de-DE");
        expect(newMessage).toBe("Hallo Welt");

        // Check that invalid locale throws an error
        await expect(() => api.setLocale("zh-CN")).rejects.toThrowErrorMatchingInlineSnapshot(
            `[Error: runtime:unsupported-locale: Unsupported locale 'zh-CN' (supported locales: de, en, de-simple).]`
        );
    });

    interface I18nAppApi {
        getLocaleInfo(): Promise<{ locale: string; message: string; supportedLocales: string[] }>;
        setLocale(newLocale: string): Promise<void>;
    }

    /**
     * Runs an app with mocked services and i18n and returns the inner locale + translated message.
     */
    async function launchApp(options?: Partial<CustomElementOptions>): Promise<I18nAppApi> {
        class TestService implements ApiExtension {
            private ctx: ApplicationContext;
            private locale: string;
            private message: string;

            constructor(options: ServiceOptions<{ ctx: ApplicationContext }>) {
                const ctx = options.references.ctx;
                this.ctx = ctx;
                this.locale = ctx.getLocale();
                this.message = options.intl.formatMessage({ id: "greeting" });
            }

            async getApiMethods(): Promise<ApiMethods> {
                return {
                    getLocaleInfo: () => {
                        return {
                            locale: this.locale,
                            message: this.message,
                            supportedLocales: Array.from(this.ctx.getSupportedLocales())
                        };
                    },
                    setLocale: (newLocale: string) => {
                        this.ctx.setLocale(newLocale);
                    }
                };
            }
        }

        const elem = createCustomElement({
            ...options,
            appMetadata: {
                packages: {
                    test: {
                        name: "test",
                        services: {
                            testService: {
                                name: "testService",
                                clazz: TestService,
                                references: {
                                    ctx: {
                                        name: "runtime.ApplicationContext"
                                    }
                                },
                                provides: [
                                    {
                                        name: "integration.ApiExtension"
                                    }
                                ]
                            }
                        }
                    }
                },
                locales: ["de", "en", "de-simple"],
                async loadMessages(locale) {
                    switch (locale) {
                        case "en":
                            return {
                                test: {
                                    greeting: "Hello world"
                                }
                            };
                        case "de":
                            return {
                                test: {
                                    greeting: "Hallo Welt"
                                }
                            };
                        case "de-simple":
                            return {
                                test: {
                                    greeting: "Hallo Welt (einfach)"
                                }
                            };
                    }
                    throw new Error("Unsupported locale: " + locale);
                }
            }
        });

        const { node } = await renderComponentShadowDOM(elem);
        const result = {
            async getLocaleInfo() {
                const api = await (node as ApplicationElement).when();
                return api.getLocaleInfo!();
            },

            async setLocale(newLocale: string) {
                const api = await (node as ApplicationElement).when();
                api.setLocale!(newLocale);
            }
        };
        return result;
    }
});

it("renders an error screen when the app fails to start", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const elem = createCustomElement({
        async resolveConfig() {
            throw new Error("help!");
        }
    });

    const { node, shadowRoot } = await renderComponentShadowDOM(elem);
    await waitFor(() => {
        const state = (node as InternalElementType).$inspectElementState?.().state;
        if (state !== "error") {
            throw new Error(`App did not reach error state.`);
        }
    });

    const errorScreen = shadowRoot.querySelector("div.pioneer-root")!;
    expect(errorScreen).toBeTruthy();

    const classes = Array.from(errorScreen.classList);
    expect(classes).toContain("pioneer-root-error-screen");

    await waitFor(() => {
        const includesErrorText = Array.from(errorScreen?.children ?? []).some((child) =>
            child.textContent?.includes("Error")
        );
        expect(includesErrorText).toBe(true);
    });
});

it("can render without a shadow root", async () => {
    function AppUI() {
        const portalContent = createElement(
            Portal,
            undefined,
            createElement(
                "div",
                { className: "portal-content", "data-testid": "portal-content" },
                "Hello from Portal"
            )
        );

        return createElement(
            "div",
            {
                "data-testid": "main-content"
            },
            "Hello World",
            portalContent
        );
    }

    const elem = createCustomElement({
        component: AppUI,
        advanced: {
            enableShadowRoot: false
        }
    });
    const { innerContainer } = await renderComponentWithoutShadowRoot(elem);

    const mainContent = await findByTestId(innerContainer, "main-content");
    expect(mainContent.textContent).toBe("Hello World");
    expect(mainContent.parentElement).toBe(innerContainer);

    // Important: portal content must be a child of the `.pioneer-root`.
    // This is currently implemented using a patch against ark ui.
    const portalContent = await findByTestId(innerContainer, "portal-content");
    expect(portalContent.textContent).toBe("Hello from Portal");
    expect(portalContent.parentElement).toBe(innerContainer);

    const styles = Array.from(document.head.querySelectorAll("style"));
    const rule = styles.find((s) => s.innerHTML.includes(".pioneer-root"));
    expect(rule).toBeTruthy(); // Styles are mounted into the document head
});

async function renderComponentWithoutShadowRoot(element: ApplicationElementConstructor) {
    const { node } = await renderComponent(element);
    const innerContainer = await waitFor(() => {
        const pioneerRoot = node.querySelector(`.pioneer-root`);
        if (!pioneerRoot) {
            throw new Error("Pioneer root node did not mount.");
        }
        return pioneerRoot as HTMLElement;
    });

    return {
        node,
        innerContainer
    };
}
