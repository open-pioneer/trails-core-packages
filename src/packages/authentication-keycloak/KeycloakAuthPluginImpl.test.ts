// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { afterEach, beforeEach, it, vi, expect, MockInstance } from "vitest";
import { KeycloakAuthPluginImpl } from "./KeycloakAuthPluginImpl";
import { createService } from "@open-pioneer/test-utils/services";
import { NotificationService, NotificationOptions } from "@open-pioneer/notifier";
import { KeycloakLoginOptions, KeycloakLogoutOptions } from "keycloak-js";

//https://vitest.dev/api/vi.html#vi-mock
const hoisted = vi.hoisted(() => {
    return {
        keycloakMock: {
            init: vi.fn(),
            updateToken: vi.fn(),
            login: vi.fn(),
            logout: vi.fn()
        }
    };
});

//The call to vi.mock is hoisted
vi.mock("keycloak-js", () => ({
    default: vi.fn().mockReturnValue(hoisted.keycloakMock)
}));

let restoreMocks: MockInstance[] = [];

beforeEach(() => {
    vi.useFakeTimers();
    restoreMocks = [];
});

afterEach(() => {
    vi.clearAllMocks();
    for (const mock of restoreMocks) {
        mock.mockRestore();
    }
});

it("expect state to be 'authenticated'", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(true);
    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");
});

it("expect state to be 'not-authenticated'", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(false);
    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "not-authenticated");
});

it("expect keycloak init to reject'", async () => {
    hoisted.keycloakMock.init.mockRejectedValue(new Error("Error"));

    const logSpy = vi.spyOn(global.console, "error").mockImplementation(() => undefined);
    restoreMocks.push(logSpy);

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
    hoisted.keycloakMock.init.mockResolvedValue(true);
    hoisted.keycloakMock.updateToken.mockRejectedValue(new Error("Error"));
    const { keycloakAuthPlugin } = await setup();

    const logSpy = vi.spyOn(global.console, "error").mockImplementation(() => undefined);
    restoreMocks.push(logSpy);

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
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
});

it("should update the token in interval", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(true);
    hoisted.keycloakMock.updateToken.mockResolvedValue(true);
    const refreshSpy = vi.spyOn(KeycloakAuthPluginImpl.prototype as any, "__refresh");
    const { keycloakAuthPlugin } = await setup();
    restoreMocks.push(refreshSpy);

    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");
    await vi.waitFor(() => expect(refreshSpy).toHaveBeenCalledTimes(1));

    vi.advanceTimersToNextTimer();
    expect(hoisted.keycloakMock.updateToken).toHaveBeenCalledTimes(1);
});

it("should call login with correct options", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(false);

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

    expect(hoisted.keycloakMock.login).toHaveBeenCalledWith(loginOptions);
});

it("should call login with default options when no custom options provided", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(false);

    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "not-authenticated");

    const loginBehavior = keycloakAuthPlugin.getLoginBehavior();
    if (loginBehavior.kind === "effect") {
        loginBehavior.login();
    } else {
        throw new Error("Unexpected login behavior kind");
    }

    expect(hoisted.keycloakMock.login).toHaveBeenCalledWith({
        redirectUri: undefined
    });
});

it("should call logout with correct options", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(true);
    const logoutOptions = {
        redirectUri: "https://example.com/logout"
    };

    const { keycloakAuthPlugin } = await setup({ logoutOptions });
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");

    keycloakAuthPlugin.logout();

    expect(hoisted.keycloakMock.logout).toHaveBeenCalledWith(logoutOptions);
});

it("should call logout with default options when no custom options provided", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(true);

    const { keycloakAuthPlugin } = await setup();
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");

    keycloakAuthPlugin.logout();

    expect(hoisted.keycloakMock.logout).toHaveBeenCalledWith({
        redirectUri: undefined
    });
});

it("should call logout with merged options when additional options are provided", async () => {
    hoisted.keycloakMock.init.mockResolvedValue(true);

    const { keycloakAuthPlugin } = await setup({
        logoutOptions: {
            redirectUri: "https://example.com/logout"
        }
    });
    await vi.waitUntil(() => keycloakAuthPlugin.getAuthState().kind === "authenticated");

    keycloakAuthPlugin.logout({
        logoutMethod: "POST"
    });

    expect(hoisted.keycloakMock.logout).toHaveBeenCalledWith({
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
