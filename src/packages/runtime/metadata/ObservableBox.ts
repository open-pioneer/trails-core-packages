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
    if (import.meta.env.DEV) {
        return new BoxImpl(value);
    } else {
        return {
            value
        };
    }
}

class BoxImpl<T> implements Required<ObservableBox<T>> {
    #signal: Reactive<T>;

    constructor(value: T) {
        this.#signal = reactive(value);
    }

    get value(): T {
        return this.#signal.value;
    }

    setValue(newValue: T): void {
        this.#signal.value = newValue;
    }
}
