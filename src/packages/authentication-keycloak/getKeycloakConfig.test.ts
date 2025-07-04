// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { KeycloakOptions } from "./api";
import { getKeycloakConfig } from "./getKeycloakConfig";

it("expect to throw an error if the keycloakConfig not provided ", async () => {
    const keycloakOptions = {
        refreshOptions: {
            autoRefresh: true,
            interval: 6000,
            timeLeft: 70
        },
        keycloakInitOptions: {
            onLoad: "check-sso",
            pkceMethod: "S256"
        },
        keycloakConfig: {}
    } as KeycloakOptions;

    const properties = {
        keycloakOptions
    };
    expect(() => getKeycloakConfig(properties)).toThrowErrorMatchingInlineSnapshot(
        `[Error: KeycloakConfig not found: The Keycloak configuration options are required by the plugin to perform login and logout operations]`
    );
});

it("expect default values are used for refreshOptions", () => {
    const keycloakOptions = {
        keycloakConfig: {
            url: "https://keycloak.example.com",
            realm: "example-realm",
            clientId: "example-client"
        }
    } as KeycloakOptions;

    const properties = {
        keycloakOptions
    };
    const config = getKeycloakConfig(properties);
    expect(config.refreshOptions).toEqual({
        autoRefresh: true,
        interval: 10000,
        timeLeft: 60
    });
});

it("expect default values for refreshOptions are overridden", () => {
    const keycloakOptions = {
        keycloakConfig: {
            url: "https://keycloak.example.com",
            realm: "example-realm",
            clientId: "example-client"
        },
        refreshOptions: {
            autoRefresh: false,
            interval: 5000,
            timeLeft: 30
        }
    } as KeycloakOptions;

    const properties = {
        keycloakOptions
    };
    const config = getKeycloakConfig(properties);
    expect(config.refreshOptions).toEqual({
        autoRefresh: false,
        interval: 5000,
        timeLeft: 30
    });
});

it("expect values for login options can be changed", () => {
    const keycloakOptions = {
        keycloakConfig: {
            url: "https://keycloak.example.com",
            realm: "example-realm",
            clientId: "example-client"
        },
        keycloakLoginOptions: {
            redirectUri: "https://example.com/login-callback"
        }
    } as KeycloakOptions;

    const properties = {
        keycloakOptions
    };
    const config = getKeycloakConfig(properties);
    expect(config.loginOptions).toEqual({
        redirectUri: "https://example.com/login-callback"
    });
});

it("expect values for logoutOptions can be changed", () => {
    const keycloakOptions = {
        keycloakConfig: {
            url: "https://keycloak.example.com",
            realm: "example-realm",
            clientId: "example-client"
        },
        keycloakLogoutOptions: {
            redirectUri: "https://example.com/logout-callback"
        }
    } as KeycloakOptions;

    const properties = {
        keycloakOptions
    };
    const config = getKeycloakConfig(properties);
    expect(config.logoutOptions).toEqual({
        redirectUri: "https://example.com/logout-callback"
    });
});
