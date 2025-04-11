// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { reactive, Reactive } from "@conterra/reactivity-core";
import { ErrorFallbackProps, ForceAuth } from "./ForceAuth";
import { AuthState, LoginBehavior, SessionInfo } from "./api";
import { Box } from "@chakra-ui/react";

it("renders children if the user is authenticated", async () => {
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "authenticated",
                sessionInfo: {
                    userId: "test-id"
                }
            })
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth>
                <div data-testid="1234">testDiv</div>
            </ForceAuth>
        </PackageContextProvider>
    );

    await screen.findByTestId("1234");
});

it("renders no children if the state is pending", async () => {
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "pending"
            })
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <div data-testid="1234">
                <ForceAuth>
                    <div>testDiv</div>
                </ForceAuth>
            </div>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("1234");
    expect(result.outerHTML).toMatchInlineSnapshot(`"<div data-testid="1234"></div>"`);
});

it("renders AuthFallback if the user is not authenticated", async () => {
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "not-authenticated"
            })
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth>
                <div data-testid="1234">testDiv</div>
            </ForceAuth>
        </PackageContextProvider>
    );

    await screen.findByTestId("LoginFallBack");
});

it("renders the AuthFallback with custom props", async () => {
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "not-authenticated"
            })
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth fallbackProps={{ name: "TestProp" }}>
                <div data-testid="1234">testDiv</div>
            </ForceAuth>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("LoginFallBack");
    expect(result.textContent).toMatchInlineSnapshot(`""TestProp""`);
});

it("renders the AuthFallback with a custom render function", async () => {
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "not-authenticated"
            })
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth
                renderFallback={(AuthFallback) => {
                    return (
                        <div data-testid="LoginFallBack-wrapper">
                            <AuthFallback name="TestProp" />
                        </div>
                    );
                }}
            >
                <div data-testid="1234">testDiv</div>
            </ForceAuth>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("LoginFallBack-wrapper");
    expect(result).toMatchInlineSnapshot(`
      <div
        data-testid="LoginFallBack-wrapper"
      >
        <div
          data-testid="LoginFallBack"
        >
          "TestProp"
        </div>
      </div>
    `);
});

it("re-renders when the service's state changes", async () => {
    const testAuthService = new TestAuthService({
        kind: "pending"
    });
    const mocks = {
        services: {
            "authentication.AuthService": testAuthService
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <div data-testid="outer-div">
                <ForceAuth>
                    <div data-testid="inner-div">testDiv</div>
                </ForceAuth>
            </div>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("outer-div");
    expect(result.outerHTML).toMatchInlineSnapshot(`"<div data-testid="outer-div"></div>"`);

    act(() => {
        testAuthService.setAuthState({
            kind: "authenticated",
            sessionInfo: {
                userId: "test-id"
            }
        });
    });

    const innerDiv = await screen.findByTestId("inner-div");
    expect(innerDiv.outerHTML).toMatchInlineSnapshot(
        `"<div data-testid="inner-div">testDiv</div>"`
    );
});

it("calls a login effect if present", async () => {
    let loginCalled = false;
    const testAuthService = new TestAuthService(
        {
            kind: "not-authenticated"
        },
        {
            kind: "effect",
            login() {
                loginCalled = true;
            }
        }
    );
    const mocks = {
        services: {
            "authentication.AuthService": testAuthService
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth>Content</ForceAuth>
        </PackageContextProvider>
    );

    await waitFor(() => {
        if (!loginCalled) {
            throw new Error("login effect was not called");
        }
    });
});

it("renders the error fallback if authentication state is erroneous", async () => {
    const error = new Error("authentication failed");
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "error",
                error: error
            })
        }
    };

    function ErrorFallback(props: ErrorFallbackProps) {
        return <Box data-testid="ErrorFallback-box">{props.error.message}</Box>;
    }

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth errorFallback={ErrorFallback}></ForceAuth>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("ErrorFallback-box");
    expect(result.innerHTML).toEqual(error.message);
});

it("uses the renderErrorFallback property if authentication state is erroneous", async () => {
    const testInput = "test input";
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "error",
                error: new Error("authentication failed")
            })
        }
    };

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth
                renderErrorFallback={() => <Box data-testid="ErrorFallback-box">{testInput}</Box>}
            ></ForceAuth>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("ErrorFallback-box");
    expect(result.innerHTML).toEqual(testInput);
});

it("should use renderErrorFallback property rather than errorFallback property if both are provided", async () => {
    const renderErrorFallbackInner = "renderErrorFallback";
    const errorFallbackInner = "errorFallback";
    const mocks = {
        services: {
            "authentication.AuthService": new TestAuthService({
                kind: "error",
                error: new Error("authentication failed")
            })
        }
    };

    function ErrorFallback() {
        return <Box data-testid="ErrorFallback-box">{errorFallbackInner}</Box>;
    }

    render(
        <PackageContextProvider {...mocks}>
            <ForceAuth
                errorFallback={ErrorFallback}
                renderErrorFallback={() => (
                    <Box data-testid="ErrorFallback-box">{renderErrorFallbackInner}</Box>
                )}
            ></ForceAuth>
        </PackageContextProvider>
    );

    const result = await screen.findByTestId("ErrorFallback-box");
    expect(result.innerHTML).toEqual(renderErrorFallbackInner);
});

class TestAuthService {
    #currentState: Reactive<AuthState>;
    #behavior: LoginBehavior;
    constructor(initState: AuthState, loginBehavior?: LoginBehavior) {
        this.#currentState = reactive<AuthState>(initState);
        this.#behavior = loginBehavior ?? {
            kind: "fallback",
            Fallback(props: Record<string, unknown>) {
                return <div data-testid="LoginFallBack">{JSON.stringify(props.name)}</div>;
            }
        };
    }
    getAuthState(): AuthState {
        return this.#currentState.value;
    }
    getSessionInfo(): Promise<SessionInfo | undefined> {
        throw new Error("Method not implemented.");
    }
    getLoginBehavior(): LoginBehavior {
        return this.#behavior;
    }
    logout() {
        throw new Error("Method not implemented.");
    }
    setAuthState(newState: AuthState) {
        this.#currentState.value = newState;
    }
}
