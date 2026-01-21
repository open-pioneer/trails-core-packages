// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger } from "@open-pioneer/core";
import type {
    KeycloakConfig,
    KeycloakInitOptions,
    KeycloakLoginOptions,
    KeycloakLogoutOptions
} from "keycloak-js";
import { sourceId } from "open-pioneer:source-info";
import type { KeycloakProperties, RefreshOptions } from "./api";
const LOG = createLogger(sourceId);

const DEFAULT_REFRESH_OPTS = {
    autoRefresh: true,
    interval: 10000,
    timeLeft: 60
} as const;

const DEFAULT_INIT_OPTS = {
    onLoad: "check-sso",
    pkceMethod: "S256"
} as const;

export type ResolvedRefreshOptions = Required<RefreshOptions>;

export interface ResolvedKeycloakOptions {
    config: KeycloakConfig;
    initOptions: KeycloakInitOptions;
    refreshOptions: ResolvedRefreshOptions;
    loginOptions: Partial<KeycloakLoginOptions>;
    logoutOptions: Partial<KeycloakLogoutOptions>;
}

/**
 * Parses the user supplied package properties.
 */
export function getKeycloakConfig(
    properties: Partial<KeycloakProperties>
): ResolvedKeycloakOptions {
    const { keycloakOptions } = properties;
    if (!keycloakOptions) {
        throw new Error(
            `KeycloakOptions not found: The Keycloak configuration options are required by the plugin to perform login and logout operations`
        );
    }
    const {
        refreshOptions,
        keycloakInitOptions,
        keycloakConfig,
        keycloakLoginOptions,
        keycloakLogoutOptions
    } = keycloakOptions;
    return {
        config: getConfig(keycloakConfig),
        refreshOptions: getRefreshOptions(refreshOptions),
        initOptions: getInitOptions(keycloakInitOptions),
        loginOptions: getLoginOptions(keycloakLoginOptions),
        logoutOptions: getLogoutOptions(keycloakLogoutOptions)
    };
}

function getConfig(keycloakConfig: KeycloakConfig | undefined): KeycloakConfig {
    if (!keycloakConfig || isObjectEmpty(keycloakConfig)) {
        throw new Error(
            `KeycloakConfig not found: The Keycloak configuration options are required by the plugin to perform login and logout operations`
        );
    }
    return { ...keycloakConfig };
}

function getRefreshOptions(refreshOptions: RefreshOptions | undefined): ResolvedRefreshOptions {
    if (!refreshOptions || isObjectEmpty(refreshOptions)) {
        LOG.info(`Using default options for keycloak token refresh`, DEFAULT_REFRESH_OPTS);
    }
    return {
        ...DEFAULT_REFRESH_OPTS,
        ...refreshOptions
    };
}

function getInitOptions(keycloakInitOptions: KeycloakInitOptions | undefined): KeycloakInitOptions {
    if (!keycloakInitOptions || isObjectEmpty(keycloakInitOptions)) {
        LOG.info(`Using default options for keycloak init`, DEFAULT_INIT_OPTS);
    }
    return {
        ...DEFAULT_INIT_OPTS,
        ...keycloakInitOptions
    };
}

function getLoginOptions(
    keycloakLoginOptions: Partial<KeycloakLoginOptions> | undefined
): Partial<KeycloakLoginOptions> {
    return {
        redirectUri: undefined, // backwards-compat; unsure if needed
        ...keycloakLoginOptions
    };
}

function getLogoutOptions(
    keycloakLogoutOptions: Partial<KeycloakLogoutOptions> | undefined
): Partial<KeycloakLogoutOptions> {
    return {
        redirectUri: undefined, // backwards-compat; unsure if needed
        ...keycloakLogoutOptions
    };
}

const isObjectEmpty = (objectName: unknown) => {
    return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object;
};
