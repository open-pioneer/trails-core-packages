// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { effect as rawEffect } from "@preact/signals-core";
import { CleanupHandle } from "@conterra/reactivity-core";

/* NOTE: Copied from @conterra/reactivity-core. Should probably have a semi-stable interface for this! */

/** @internal */
export interface RawWatcher extends CleanupHandle {
    /**
     * Starts a tracking context. Use the returned callback to end the context.
     */
    start(): () => void;
}

/**
 * Creates a watcher that calls the `onNotify` callback when a signal
 * used within the watcher's tracking context changed.
 *
 * The tracking context is started by calling the `start` method on the returned
 * watcher.
 *
 * @internal
 */
export function createWatcher(onChange: () => void): RawWatcher {
    // Uses the effect's internals to track signal invalidations.
    // The effect body is only called once!
    // See https://github.com/preactjs/signals/issues/593#issuecomment-2349672856
    let start!: () => () => void;
    const destroy = rawEffect(function (this: RawEffectInternals) {
        this[_CALLBACK] = onChange.bind(undefined); // hide 'this'
        start = this[_START].bind(this);
    });
    return {
        destroy,
        start
    };
}

// Mangled member names. See https://github.com/preactjs/signals/blob/main/mangle.json.
const _NOTIFY = "N";
const _START = "S";
const _CALLBACK = "c";

interface RawEffectInternals {
    // Notifies the effect that a dependency has changed.
    // This usually schedules the effect to run again (when not overridden).
    [_NOTIFY](): void;

    // Starts the effect and returns a function ("finish") to stop it again.
    // Signal accesses are tracked while the effect is running.
    [_START](): () => void;

    // Called when the effect can run (e.g. after batch completes).
    // The default implementation runs the effect function again, surrounded by
    // `start` and `finish`.
    [_CALLBACK](): void;
}
