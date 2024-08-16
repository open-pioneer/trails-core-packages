// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    AuthPlugin,
    AuthState,
    LoginBehavior
} from "@open-pioneer/authentication";
import { Service } from "@open-pioneer/runtime";
import { createElement } from "react";
import { LoginMask } from "./LoginMask";
import { reactive } from "@conterra/reactivity-core";

export class TestAuthPlugin implements Service, AuthPlugin {
    #state = reactive<AuthState>({
        kind: "pending"
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #timerId: any;
    #wasLoggedIn = false;

    constructor() {
        // Delay state change to simulate a delay that may be needed to
        // determine the user's login state (e.g. rest request).
        this.#timerId = setTimeout(() => {
            this.#state.value = {
                kind: "not-authenticated"
            };
        }, 500);
    }

    destroy() {
        clearTimeout(this.#timerId);
        this.#timerId = undefined;
    }

    getAuthState(): AuthState {
        return this.#state.value;
    }

    getLoginBehavior(): LoginBehavior {
        // Trivial username / password check called by the react component.
        // The plugin's state changes if the credentials are correct.
        const doLogin = (userName: string, password: string): string | undefined => {
            if (userName === "admin" && password === "admin") {
                this.#state.value = {
                    kind: "authenticated",
                    sessionInfo: {
                        userId: "admin",
                        userName: "Arnold Administrator"
                    }
                };
                this.#wasLoggedIn = true;
            } else {
                return "Invalid user name or password!";
            }
        };

        // This component is rendered when the user is not logged in, for example
        // by the `<ForceAuth />` component.
        const AuthFallback = () =>
            createElement(LoginMask, {
                doLogin: doLogin,
                wasLoggedIn: this.#wasLoggedIn
            });
        return {
            kind: "fallback",
            Fallback: AuthFallback
        };
    }

    logout() {
        if (this.#state.value.kind === "authenticated" || this.#state.value.kind === "pending") {
            this.#state.value = {
                kind: "not-authenticated"
            };
            clearTimeout(this.#timerId);
            this.#timerId = undefined;
        }
    }
}
