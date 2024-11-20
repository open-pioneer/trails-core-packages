// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    ManualPromise,
    Resource,
    createAbortError,
    createManualPromise,
    destroyResource,
    createLogger
} from "@open-pioneer/core";
import type { AuthPlugin, AuthService, AuthState, LoginBehavior, SessionInfo } from "./api";
import type { Service, ServiceOptions } from "@open-pioneer/runtime";
import { syncWatch } from "@conterra/reactivity-core";

const LOG = createLogger("authentication:AuthService");

export class AuthServiceImpl implements AuthService, Service {
    #plugin: AuthPlugin;
    #whenUserInfo: ManualPromise<SessionInfo | undefined> | undefined;
    #watchPluginStateHandle: Resource | undefined;

    constructor(serviceOptions: ServiceOptions<{ plugin: AuthPlugin }>) {
        this.#plugin = serviceOptions.references.plugin;

        this.#watchPluginStateHandle = syncWatch(
            () => [this.#plugin.getAuthState()],
            ([state]) => {
                this.#onPluginStateChanged(state);
            },
            {
                immediate: false
            }
        );
        LOG.debug(
            `Constructed with initial auth state '${this.getAuthState().kind}'`,
            this.getAuthState()
        );
    }

    destroy(): void {
        this.#whenUserInfo?.reject(createAbortError());
        this.#whenUserInfo = undefined;
        this.#watchPluginStateHandle = destroyResource(this.#watchPluginStateHandle);
    }

    getAuthState(): AuthState {
        return this.#plugin.getAuthState();
    }

    getSessionInfo(): Promise<SessionInfo | undefined> {
        if (this.getAuthState().kind !== "pending") {
            return Promise.resolve(getSessionInfo(this.getAuthState()));
        }

        if (!this.#whenUserInfo) {
            this.#whenUserInfo = createManualPromise();
        }
        return this.#whenUserInfo.promise;
    }

    getLoginBehavior(): LoginBehavior {
        return this.#plugin.getLoginBehavior();
    }

    logout(): void {
        LOG.debug("Triggering logout");
        this.#plugin.logout();
    }

    #onPluginStateChanged(newState: AuthState) {
        if (newState.kind !== "pending" && this.#whenUserInfo) {
            this.#whenUserInfo.resolve(getSessionInfo(newState));
            this.#whenUserInfo = undefined;
        }
        LOG.debug(`Auth state changed to '${newState.kind}'`, newState);
    }
}

function getSessionInfo(state: AuthState): SessionInfo | undefined {
    return state.kind === "authenticated" ? state.sessionInfo : undefined;
}
