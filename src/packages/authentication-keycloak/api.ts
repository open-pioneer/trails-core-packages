// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthPlugin } from "@open-pioneer/authentication";
import { DECLARE_SERVICE_INTERFACE } from "@open-pioneer/runtime";
import type {
    KeycloakConfig,
    KeycloakInitOptions,
    KeycloakLoginOptions,
    KeycloakLogoutOptions
} from "keycloak-js";

/**
 * The central configuration properties of the plugin.
 *
 * An object of this type should be used as configuration for this package.
 */
export interface KeycloakProperties {
    /**
     * These properties are required by the Keycloak JavaScript adapter.
     */
    keycloakOptions: KeycloakOptions;
}

export interface KeycloakOptions {
    /**
     * The configuration details for connecting to Keycloak.
     *
     * - 'url': The URL of your Keycloak server.
     * - 'realm': The realm within Keycloak.
     * - 'clientId': The ID of the client application registered in Keycloak.
     */
    keycloakConfig: KeycloakConfig;

    /**
     * Control the automatic refreshing of authentication tokens.
     *
     * - 'autoRefresh': Whether token refreshing should happen automatically.
     * - 'interval': The interval (in milliseconds) at which token refreshing should occur.
     * - 'timeLeft': The remaining time (in milliseconds) before token expiration.
     */
    refreshOptions?: RefreshOptions;

    /**
     * Define how Keycloak initializes.
     *
     * These properties can be used:
     * - 'onLoad': Specifies when Keycloak should initialize. Default: `check-sso`.
     * - 'pkceMethod': The method used for PKCE for enhanced security. Default: `S256`.
     * - 'scope': The scope of the authentication.
     */
    keycloakInitOptions?: Partial<KeycloakInitOptions>;

    /**
     * Define behavior when the user logs in.
     */
    keycloakLoginOptions?: Partial<KeycloakLoginOptions>;

    /**
     * Define behavior when the user logs out.
     */
    keycloakLogoutOptions?: Partial<KeycloakLogoutOptions>;
}

/**
 * Control the automatic refreshing of authentication tokens.
 */
export interface RefreshOptions {
    /**
     * Whether token refreshing should happen automatically.
     *
     * Default: true.
     */
    autoRefresh?: boolean;

    /**
     * The interval (in milliseconds) at which tokens are checked for validity.
     * If the token's remaining lifetime is too short (see {@link timeLeft}), then the token is refreshed.
     *
     * Default: 10000 milliseconds.
     */
    interval?: number;

    /**
     * The minimum required lifetime during token validity checks.
     * Tokens that expire within `timeLeft` are refreshed.
     *
     * Default: 60 seconds.
     */
    timeLeft?: number;
}

/**
 * The interface implemented by the Keycloak authentication plugin.
 */
export interface KeycloakAuthPlugin extends AuthPlugin {
    readonly [DECLARE_SERVICE_INTERFACE]?: "authentication-keycloak.KeycloakAuthPlugin";

    /**
     * Explicitly triggers a logout.
     *
     * `options` used here can override the package properties used by the plugin.
     */
    logout(options?: Partial<KeycloakLogoutOptions>): void;
}
