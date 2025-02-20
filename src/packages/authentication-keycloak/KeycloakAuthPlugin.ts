// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { AuthPlugin, AuthState, LoginBehavior } from "@open-pioneer/authentication";
import { Resource, createLogger, destroyResource } from "@open-pioneer/core";
import { NotificationService } from "@open-pioneer/notifier";
import {
    PackageIntl,
    Service,
    ServiceOptions,
    type DECLARE_SERVICE_INTERFACE
} from "@open-pioneer/runtime";
import Keycloak, {
    type KeycloakConfig,
    type KeycloakInitOptions,
    type KeycloakLoginOptions,
    type KeycloakLogoutOptions
} from "keycloak-js";
import { KeycloakOptions, KeycloakProperties, RefreshOptions } from "./api";

const LOG = createLogger("authentication-keycloak:KeycloakAuthPlugin");

interface References {
    notifier: NotificationService;
}

export class KeycloakAuthPlugin implements Service, AuthPlugin {
    declare [DECLARE_SERVICE_INTERFACE]: "authentication-keycloak.KeycloakAuthPlugin";

    #notifier: NotificationService;
    #intl: PackageIntl;
    #keycloakOptions: KeycloakOptions;
    #keycloak: Keycloak;
    #logoutOptions: KeycloakLogoutOptions;
    #loginOptions: KeycloakLoginOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #timerId: any;
    #watcher: Resource | undefined;

    #state = reactive<AuthState>({
        kind: "pending"
    });

    constructor(options: ServiceOptions<References>) {
        this.#notifier = options.references.notifier;
        this.#intl = options.intl;
        this.#logoutOptions = { redirectUri: undefined };
        this.#loginOptions = { redirectUri: undefined };

        try {
            this.#keycloakOptions = getKeycloakConfig(options.properties);
        } catch (e) {
            throw new Error("Invalid keycloak configuration", { cause: e });
        }

        try {
            this.#keycloak = new Keycloak(this.#keycloakOptions.keycloakConfig);
        } catch (e) {
            throw new Error("Failed to construct keycloak instance", { cause: e });
        }
        this.#init().catch((e) => {
            this.#updateState({
                kind: "error",
                error: e
            });
            this.#notifier.notify({
                level: "error",
                title: this.#intl.formatMessage({
                    id: "loginFailed.title"
                }),
                message: this.#intl.formatMessage({
                    id: "loginFailed.message"
                })
            });

            LOG.error("Failed to check if user is authenticated", e);
        });
    }

    destroy() {
        clearInterval(this.#timerId);
        this.#watcher = destroyResource(this.#watcher);
        this.#timerId = undefined;
    }

    getAuthState(): AuthState {
        return this.#state.value;
    }

    getLoginBehavior(): LoginBehavior {
        const doLogin = () => {
            LOG.debug("Login with options", this.#loginOptions);
            this.#keycloak.login(this.#loginOptions);
        };
        return {
            kind: "effect",
            login: doLogin
        };
    }

    logout() {
        LOG.debug("Logout with options", this.#logoutOptions);
        this.#keycloak.logout(this.#logoutOptions);
    }

    async #init() {
        const keycloakOptions = this.#keycloakOptions;
        const initOptions = this.#keycloakOptions.keycloakInitOptions;
        const refreshOptions = keycloakOptions.refreshOptions;

        let isAuthenticated: boolean;
        try {
            isAuthenticated = await this.#keycloak.init(initOptions);
        } catch (e) {
            // Note: keycloak.init() can also throw an exception, in addition to a rejected promise.
            // It may also just throw a string..
            const error = typeof e === "string" ? new Error(e) : e;
            throw new Error("Failed to initialize keycloak session", { cause: error });
        }

        if (isAuthenticated) {
            this.#updateState({
                kind: "authenticated",
                sessionInfo: {
                    userId: this.#keycloak.subject ? this.#keycloak.subject : "undefined",
                    userName: this.#keycloak.idTokenParsed?.preferred_username,
                    attributes: {
                        keycloak: this.#keycloak,
                        familyName: this.#keycloak.idTokenParsed?.family_name,
                        givenName: this.#keycloak.idTokenParsed?.given_name,
                        userName: this.#keycloak.idTokenParsed?.preferred_username
                    }
                }
            });

            LOG.debug(`User ${this.#keycloak.subject} is authenticated`);

            if (refreshOptions.autoRefresh) {
                LOG.debug("Starting auto-refresh", refreshOptions);
                this.__refresh(refreshOptions.interval, refreshOptions.timeLeft);
            }
        } else {
            this.#updateState({
                kind: "not-authenticated"
            });
            LOG.debug("User is not authenticated");
        }
    }

    // Mocked in test
    private __refresh(interval: number, timeLeft: number) {
        clearInterval(this.#timerId);
        this.#timerId = setInterval(() => {
            this.#keycloak.updateToken(timeLeft).catch((e) => {
                LOG.error("Failed to refresh token", e);
                this.#updateState({
                    kind: "not-authenticated"
                });
                this.destroy();
            });
        }, interval);
    }

    #updateState(newState: AuthState) {
        this.#state.value = newState;
    }
}

const DEFAULT_AUTO_REFRESH_OPT = {
    autoRefresh: true,
    interval: 6000,
    timeLeft: 70
};

const DEFAULT_INIT_OPT = {
    onLoad: "check-sso",
    pkceMethod: "S256"
};

export function getKeycloakConfig(properties: Partial<KeycloakProperties>): KeycloakOptions {
    const { keycloakOptions } = properties;

    const { refreshOptions, keycloakInitOptions, keycloakConfig } = keycloakOptions!;

    return {
        refreshOptions: { ...getRefreshOpt(refreshOptions) },
        keycloakInitOptions: { ...getInitOpt(keycloakInitOptions) },
        keycloakConfig: { ...getConfigOpt(keycloakConfig) }
    };
}

function getRefreshOpt(autoRefreshOptions: RefreshOptions | undefined): RefreshOptions {
    if (!autoRefreshOptions || isObjectEmpty(autoRefreshOptions)) {
        LOG.warn(
            `The autorefresh options of the Keycloak configuration should be set to ensure automatic refreshes at specified intervals.` +
                ` Defaulting to '${DEFAULT_AUTO_REFRESH_OPT}'.`
        );
        return Object.assign({}, { ...DEFAULT_AUTO_REFRESH_OPT });
    }
    return autoRefreshOptions;
}

function getInitOpt(keycloakInitOptions: KeycloakInitOptions | undefined): KeycloakInitOptions {
    if (!keycloakInitOptions || isObjectEmpty(keycloakInitOptions)) {
        LOG.warn(
            `The Keycloak init options of the keycloak configuration should be set.` +
                ` Defaulting to '${DEFAULT_INIT_OPT}'.`
        );
        return Object.assign({}, { ...DEFAULT_INIT_OPT }) as KeycloakInitOptions;
    }
    return keycloakInitOptions;
}

function getConfigOpt(keycloakConfig: KeycloakConfig | undefined): KeycloakConfig {
    if (!keycloakConfig || isObjectEmpty(keycloakConfig)) {
        throw new Error(
            `KeycloakConfig not found: The Keycloak configuration options are required by the plugin to perform login and logout operations`
        );
    }
    return keycloakConfig;
}

const isObjectEmpty = (objectName: unknown) => {
    return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object;
};
