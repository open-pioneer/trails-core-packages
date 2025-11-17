// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { FC, memo, useRef, useSyncExternalStore } from "react";
import { createWatcher, RawWatcher } from "./hacks/Watcher";

// TODO:
/* eslint-disable no-constant-binary-expression */

export function autoReactive<Props extends {}>(innerComponent: FC<Props>): FC<Props> {
    const innerDisplayName = innerComponent.displayName ?? innerComponent.name ?? "<unnamed>";

    const ReactiveComponent: FC<Props> = (props) => {
        return useAutoReactive(() => innerComponent(props), innerDisplayName);
    };
    ReactiveComponent.displayName = `AutoReactive(${innerDisplayName})`;
    return memo(ReactiveComponent);
}

interface AutoReactiveState {
    /**
     * Watcher instance for reactivity.
     * Undefined if disposed.
     */
    watcher: RawWatcher | undefined;

    /**
     * Returns the current watcher.
     * Lazily re-initializes it if necessary.
     */
    ensureWatcher: () => RawWatcher;

    /** Incremented on every change. */
    version: number;

    /** Updates the version and invokes callback(s). */
    triggerChange: () => void;

    /** Stable callbacks for react's useSyncExternalStore hook. */
    readonly subscribe: (cb: () => void) => () => void;
    readonly getVersion: () => number;

    /** React's useSyncExternalStore callback (if subscribed). */
    callback: (() => void) | undefined;
}

// Name starts with "use" to satisfy the react lint rules.
// This is not a real hook.
function useAutoReactive<T>(render: () => T, name: string): T {
    // TODO: Figure out finalization and cleanup.
    const state = useReactiveState(name);
    const watcher = state.ensureWatcher();

    // Subscribe to the version.
    // The actual value is not used; we just use it to trigger re-renders
    // when any reactive dependencies have changed.
    void useSyncExternalStore(state.subscribe, state.getVersion);

    // Reactive dependencies are tracked until `finish` is called;
    (import.meta.env.DEV || true) && console.debug(`[AutoReactive: ${name}] Rendering`);
    const finish = watcher.start();

    let result: T;
    let error: unknown;
    let hasError = false;
    try {
        result = render();
    } catch (e) {
        hasError = true;
        error = e;
    } finally {
        // End of tracked context
        finish();
    }

    if (hasError) {
        throw error;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result!;
}

/**
 * Returns the state object for tracking reactive changes.
 * This object is initialized once per component and remains stable (although
 * its inner state may change).
 */
function useReactiveState(name: string) {
    const stateRef = useRef<AutoReactiveState>(undefined);
    if (stateRef.current) {
        return stateRef.current;
    }

    // DO NOT reference `stateRef` in this object at all.
    // That would interfere with memory management and prevent automatic cleanup
    // for unused instances.
    const state: AutoReactiveState = {
        watcher: undefined,
        ensureWatcher: () => {
            if (state.watcher) {
                return state.watcher;
            }

            (import.meta.env.DEV || true) &&
                console.debug(`[AutoReactive: ${name}] Creating new watcher`);
            return (state.watcher = createWatcher(state.triggerChange));
        },

        version: 0,
        triggerChange: () => {
            state.version = (state.version + 1) | 0;
            state.callback?.();

            (import.meta.env.DEV || true) &&
                console.debug(`[AutoReactive: ${name}] Version changed to ${state.version}`);
        },

        subscribe: (cb: () => void) => {
            if (state.callback) {
                throw new Error("Internal error: multiple subscribers are present");
            }

            (import.meta.env.DEV || true) &&
                console.debug(`[AutoReactive: ${name}] Incoming subscription`);
            if (!state.watcher) {
                // Watcher was disposed, this can happen in combination with react's strict mode etc.
                (import.meta.env.DEV || true) &&
                    console.debug(`[AutoReactive: ${name}] Subscribe without active watcher`);
                state.ensureWatcher();
                state.triggerChange();
            }

            state.callback = cb;
            return () => {
                state.watcher?.destroy();
                state.watcher = undefined;
                state.callback = undefined;

                (import.meta.env.DEV || true) &&
                    console.debug(`[AutoReactive: ${name}] Subscription was cleaned up`);
            };
        },
        getVersion: () => state.version,
        callback: undefined
    };
    return (stateRef.current = state);
}
