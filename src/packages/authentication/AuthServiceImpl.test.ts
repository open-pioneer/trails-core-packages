// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
/**
 * @vitest-environment node
 */
import { it, expect } from "vitest";
import { AuthPlugin, AuthState, LoginFallback } from "./api";
import { createElement } from "react";
import { createService } from "@open-pioneer/test-utils/services";
import { AuthServiceImpl } from "./AuthServiceImpl";
import { reactive, syncWatch } from "@conterra/reactivity-core";

it("forwards the authentication plugin's state changes", async () => {
    const plugin = new TestPlugin();
    const authService = await createService(AuthServiceImpl, {
        references: {
            plugin: plugin
        }
    });

    const observedStates: AuthState[] = [];
    syncWatch(
        () => [authService.getAuthState()],
        ([state]) => {observedStates.push(state);},
        {
            immediate: true
        }
    );

    plugin.$setAuthState({ kind: "pending" });
    plugin.$setAuthState({
        kind: "authenticated",
        sessionInfo: {
            userId: "t.user"
        }
    });
    plugin.$setAuthState({ kind: "not-authenticated" });

    expect(observedStates).toMatchInlineSnapshot(`
      [
        {
          "kind": "not-authenticated",
        },
        {
          "kind": "pending",
        },
        {
          "kind": "authenticated",
          "sessionInfo": {
            "userId": "t.user",
          },
        },
        {
          "kind": "not-authenticated",
        },
      ]
    `);
});

it("creates a promise that resolves once the plugin is no longer pending", async () => {
    const plugin = new TestPlugin();
    plugin.$setAuthState({ kind: "pending" });
    const authService = await createService(AuthServiceImpl, {
        references: {
            plugin: plugin
        }
    });
    expect(authService.getAuthState().kind).toBe("pending");

    let didResolve = false;
    const sessionInfoPromise = authService.getSessionInfo().then((info) => {
        didResolve = true;
        return info;
    });
    await sleep(25);
    expect(didResolve).toBe(false);

    plugin.$setAuthState({
        kind: "authenticated",
        sessionInfo: {
            userId: "t.user"
        }
    });
    const sessionInfo = await sessionInfoPromise;
    expect(sessionInfo?.userId).toBe("t.user");
});

it("returns the authentication plugins fallback", async () => {
    const plugin = new TestPlugin();
    const authService = await createService(AuthServiceImpl, {
        references: {
            plugin: plugin
        }
    });

    const behavior = authService.getLoginBehavior();
    expect(behavior.kind).toBe("fallback");
    expect((behavior as LoginFallback).Fallback).toBe(DummyFallback);
});

it("calls the plugin's logout method", async () => {
    const plugin = new TestPlugin();
    const authService = await createService(AuthServiceImpl, {
        references: {
            plugin: plugin
        }
    });

    expect(plugin.$logoutCalled).toBe(0);
    await authService.logout();
    expect(plugin.$logoutCalled).toBe(1);
});

class TestPlugin implements AuthPlugin {
    #state  = reactive<AuthState>( {
        kind: "not-authenticated"
    });

    $logoutCalled = 0;

    getAuthState(): AuthState {
        return this.#state.value;
    }

    getLoginBehavior(): LoginFallback {
        return {
            kind: "fallback",
            Fallback: DummyFallback
        };
    }

    logout(): void {
        ++this.$logoutCalled;
    }

    $setAuthState(newState: AuthState) {
        this.#state.value = newState;
    }
}

function DummyFallback(): JSX.Element {
    return createElement("span", undefined, "Permission denied");
}

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}
