// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { deepEqual as deepEqualImpl, shallowEqual as shallowEqualImpl } from "fast-equals";

/**
 * Compares two values using shallow equality.
 *
 * This is useful when you want to detect changes on the top level without
 * recursively traversing nested objects.
 *
 * Primitive values are compared by value.
 * Arrays and objects are compared by their own enumerable keys, but nested values are only compared
 * by reference. Circular objects are not supported.
 *
 * > NOTE: This function is intended to be used with _plain old data_ inputs (i.e. mostly JSON).
 *
 * Examples:
 *
 * ```ts
 * shallowEqual({ a: 1 }, { a: 1 }); // true
 * shallowEqual({ a: { x: 1 } }, { a: { x: 1 } }); // false
 * shallowEqual([1, 2], [1, 2]); // true
 * shallowEqual(() => 1, () => 1); // false
 *
 * ```
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
    return shallowEqualImpl(a, b);
}

/**
 * Compares two values using deep equality.
 *
 * This is useful when you need to verify structural equality of nested data.
 *
 * Primitive values are compared by value.
 * Arrays and objects are traversed recursively, so nested values must also be equal.
 * Functions are compared by reference. Circular objects are not supported.
 *
 * > NOTE: This function is intended to be used with _plain old data_ inputs (i.e. mostly JSON).
 *
 * Examples:
 *
 * ```ts
 * deepEqual({ a: { x: 1 } }, { a: { x: 1 } }); // true
 * deepEqual([1, [2, 3]], [1, [2, 3]]); // true
 * deepEqual(() => 1, () => 1); // false
 * ```
 */
export function deepEqual(a: unknown, b: unknown): boolean {
    return deepEqualImpl(a, b);
}
