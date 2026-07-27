// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { reactive, Reactive } from "@conterra/reactivity-core";

export interface ObservableBox<T> {
    /** The current value. Reactive. */
    readonly value: T;

    /**
     * Changes the current value.
     *
     * Note that this function is only present during development to facilitate hot reloading.
     */
    setValue?(newValue: T): void;
}

/**
 * Returns a boxed value.
 * In development node, the box value can be changed and observed.
 */
export function createBox<T>(value: T): ObservableBox<T> {
    return new BoxImpl(value);
}

/** @internal */
export function isBox<T>(value: T | ObservableBox<T>): value is ObservableBox<T> {
    return value instanceof BoxImpl;
}

/** @internal */
export function unwrapBox<T>(value: T | ObservableBox<T>): T {
    return isBox(value) ? value.value : value;
}

class BoxImpl<T> implements ObservableBox<T> {
    #signal: Reactive<T>;

    readonly setValue?: (newValue: T) => void;

    constructor(value: T) {
        this.#signal = reactive(value);
        if (import.meta.env.DEV) {
            this.setValue = (newValue) => {
                this.#signal.value = newValue;
            };
        }
    }

    get value(): T {
        return this.#signal.value;
    }
}
