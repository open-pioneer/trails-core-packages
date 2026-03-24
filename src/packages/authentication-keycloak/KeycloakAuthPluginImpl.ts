// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { AuthState, LoginBehavior } from "@open-pioneer/authentication";
import { createLogger, destroyResource, Resource } from "@open-pioneer/core";
import { NotificationService } from "@open-pioneer/notifier";
import {
    PackageIntl,
    Service,
    ServiceOptions,
    type DECLARE_SERVICE_INTERFACE
} from "@open-pioneer/runtime";
import Keycloak, { KeycloakLogoutOptions } from "keycloak-js";
import { sourceId } from "open-pioneer:source-info";
import { KeycloakAuthPlugin } from "./api";
import { getKeycloakConfig, ResolvedKeycloakOptions } from "./getKeycloakConfig";

const LOG = createLogger(sourceId);

interface References {
    notifier: NotificationService;
}

export class KeycloakAuthPluginImpl implements Service, KeycloakAuthPlugin {
    declare [DECLARE_SERVICE_INTERFACE]: "authentication-keycloak.KeycloakAuthPlugin";

    #notifier: NotificationService;
    #intl: PackageIntl;
    #keycloakOptions: ResolvedKeycloakOptions;
    #keycloak: Keycloak;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #timerId: any;
    #watcher: Resource | undefined;

    #state = reactive<AuthState>({
        kind: "pending"
    });

    constructor(options: ServiceOptions<References>) {
        this.#notifier = options.references.notifier;
        this.#intl = options.intl;

        try {
            this.#keycloakOptions = getKeycloakConfig(options.properties);
        } catch (e) {
            throw new Error("Invalid keycloak configuration", { cause: e });
        }

        try {
            this.#keycloak = new Keycloak(this.#keycloakOptions.config);
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
            const options = this.#keycloakOptions.loginOptions;
            LOG.debug("Login with options", options);
            this.#keycloak.login(options);
        };
        return {
            kind: "effect",
            login: doLogin
        };
    }

    logout(options?: Partial<KeycloakLogoutOptions>) {
        const logoutOptions = {
            ...this.#keycloakOptions.logoutOptions,
            ...options
        };
        LOG.debug("Logout with options", logoutOptions);
        this.#keycloak.logout(logoutOptions);
    }

    async #init() {
        const { initOptions, refreshOptions } = this.#keycloakOptions;

        let isAuthenticated: boolean;
        try {
            LOG.debug("Init with options", initOptions);
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
            LOG.debug("Checking token validity");
            this.#keycloak
                .updateToken(timeLeft)
                .then((refreshed) => {
                    if (refreshed) {
                        LOG.debug("Token refreshed successfully");
                    } else {
                        LOG.debug("Token is still valid");
                    }
                })
                .catch((e) => {
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
