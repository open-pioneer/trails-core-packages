// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { afterEach, beforeEach, it, vi, expect, onTestFinished } from "vitest";
import { KeycloakAuthPluginImpl } from "./KeycloakAuthPluginImpl";
import { createService } from "@open-pioneer/test-utils/services";
import { NotificationService, NotificationOptions } from "@open-pioneer/notifier";
import { KeycloakLoginOptions, KeycloakLogoutOptions } from "keycloak-js";

//https://vitest.dev/api/vi.html#vi-mock
const MOCKS = vi.hoisted(() => {
    return {
        init: vi.fn(),
        updateToken: vi.fn(),
        login: vi.fn(),
        logout: vi.fn()
    };
});

//The call to vi.mock is hoisted
vi.mock("keycloak-js", () => ({
    default: class KeycloakMock {
        constructor() {}

        init = MOCKS.init;
        updateToken = MOCKS.updateToken;
        login = MOCKS.login;
        logout = MOCKS.logout;
    }
}));

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

it("expect state to be 'authenticated'", async () => {
    MOCKS.init.mockResolvedValue(true);
    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");
});

it("expect state to be 'not-authenticated'", async () => {
    MOCKS.init.mockResolvedValue(false);
    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "not-authenticated");
});

it("expect keycloak init to reject'", async () => {
    MOCKS.init.mockRejectedValue(new Error("Error"));

    const logSpy = mockConsoleError();

    const { notifier } = await setup();
    await vi.waitUntil(() => logSpy.mock.calls.length > 0); // wait until error is logged
    expect(logSpy).toMatchInlineSnapshot(`
      [MockFunction error] {
        "calls": [
          [
            "[ERROR] authentication-keycloak:KeycloakAuthPlugin: Failed to check if user is authenticated",
            [Error: Failed to initialize keycloak session],
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
    expect(notifier._notifications).toMatchInlineSnapshot(`
      [
        {
          "level": "error",
          "message": "loginFailed.message",
          "title": "loginFailed.title",
        },
      ]
    `);
});

it("should reject by updating the token", async () => {
    MOCKS.init.mockResolvedValue(true);
    MOCKS.updateToken.mockRejectedValue(new Error("Error"));
    const { keycloakAuthPlugin } = await setup();

    const logSpy = mockConsoleError();

    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");
    vi.advanceTimersToNextTimer();

    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "not-authenticated");
    expect(logSpy).toMatchInlineSnapshot(`
      [MockFunction error] {
        "calls": [
          [
            "[ERROR] authentication-keycloak:KeycloakAuthPlugin: Failed to refresh token",
            [Error: Error],
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
});

it("should update the token in interval", async () => {
    MOCKS.init.mockResolvedValue(true);
    MOCKS.updateToken.mockResolvedValue(true);
    const refreshSpy = vi.spyOn(KeycloakAuthPluginImpl.prototype as any, "__refresh");
    const { keycloakAuthPlugin } = await setup();

    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");
    await vi.waitFor(() => expect(refreshSpy).toHaveBeenCalledTimes(1));

    vi.advanceTimersToNextTimer();
    expect(MOCKS.updateToken).toHaveBeenCalledTimes(1);
});

it("should call login with correct options", async () => {
    MOCKS.init.mockResolvedValue(false);

    const loginOptions = {
        redirectUri: "https://example.com/callback"
    };
    const { keycloakAuthPlugin } = await setup({ loginOptions });
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "not-authenticated");

    const loginBehavior = keycloakAuthPlugin.getLoginBehavior();
    if (loginBehavior.kind === "effect") {
        loginBehavior.login();
    } else {
        throw new Error("Unexpected login behavior kind");
    }

    expect(MOCKS.login).toHaveBeenCalledWith(loginOptions);
});

it("should call login with default options when no custom options provided", async () => {
    MOCKS.init.mockResolvedValue(false);

    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "not-authenticated");

    const loginBehavior = keycloakAuthPlugin.getLoginBehavior();
    if (loginBehavior.kind === "effect") {
        loginBehavior.login();
    } else {
        throw new Error("Unexpected login behavior kind");
    }

    expect(MOCKS.login).toHaveBeenCalledWith({
        redirectUri: undefined
    });
});

it("should call logout with correct options", async () => {
    MOCKS.init.mockResolvedValue(true);
    const logoutOptions = {
        redirectUri: "https://example.com/logout"
    };

    const { keycloakAuthPlugin } = await setup({ logoutOptions });
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");

    keycloakAuthPlugin.logout();

    expect(MOCKS.logout).toHaveBeenCalledWith(logoutOptions);
});

it("should call logout with default options when no custom options provided", async () => {
    MOCKS.init.mockResolvedValue(true);

    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");

    keycloakAuthPlugin.logout();

    expect(MOCKS.logout).toHaveBeenCalledWith({
        redirectUri: undefined
    });
});

it("should call logout with merged options when additional options are provided", async () => {
    MOCKS.init.mockResolvedValue(true);

    const { keycloakAuthPlugin } = await setup({
        logoutOptions: {
            redirectUri: "https://example.com/logout"
        }
    });
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");

    keycloakAuthPlugin.logout({
        logoutMethod: "POST"
    });

    expect(MOCKS.logout).toHaveBeenCalledWith({
        redirectUri: "https://example.com/logout",
        logoutMethod: "POST"
    });
});

type MockedNotifier = Partial<NotificationService> & { _notifications: NotificationOptions[] };

interface SetupOptions {
    loginOptions?: KeycloakLoginOptions;
    logoutOptions?: KeycloakLogoutOptions;
}

async function setup(options: SetupOptions = {}) {
    const notifier = {
        _notifications: [] as NotificationOptions[],

        notify(options) {
            this._notifications.push(options);
        }
    } satisfies MockedNotifier;
    const keycloakAuthPlugin = createService(KeycloakAuthPluginImpl, {
        properties: {
            keycloakOptions: {
                refreshOptions: {
                    autoRefresh: true,
                    interval: 6000,
                    timeLeft: 70
                },
                keycloakInitOptions: {
                    onLoad: "check-sso",
                    pkceMethod: "S256",
                    scope: "data:read"
                },
                keycloakConfig: {
                    url: "https://auth.exaple.com/",
                    realm: "realm",
                    clientId: "test-id"
                },
                keycloakLogoutOptions: options.logoutOptions ?? null,
                keycloakLoginOptions: options.loginOptions ?? null
            }
        },
        references: {
            notifier
        }
    });

    return { notifier, keycloakAuthPlugin };
}

function mockConsoleError() {
    const logSpy = vi.spyOn(global.console, "error").mockImplementation(() => undefined);
    onTestFinished(() => {
        logSpy.mockRestore();
    });
    return logSpy;
}
