// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/**
 * Like a readonly signal, but only the `value` property.
 *
 * This makes it easier to run the same code during dev (with signals for HMR)
 * and during prod (value never changes).
 */
export interface ReadonlyValue<T> {
    readonly value: T;
}
