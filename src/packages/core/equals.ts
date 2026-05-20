// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { deepEqual, shallowEqual } from "fast-equals";

/**
 * Compares two values using shallow equality.
 *
 * This is useful when you want to detect changes on the top level without
 * recursively traversing nested objects.
 *
 * Primitive values are compared by value.
 * Arrays and objects are compared by their own enumerable keys, but nested values are only compared
 * by reference.
 *
 * Examples:
 *
 * ```ts
 * shallowEquals({ a: 1 }, { a: 1 }); // true
 * shallowEquals({ a: { x: 1 } }, { a: { x: 1 } }); // false
 * shallowEquals([1, 2], [1, 2]); // true
 * shallowEquals(() => 1, () => 1); // false
 *
 * ```
 */
export function shallowEquals(a: unknown, b: unknown): boolean {
    return shallowEqual(a, b);
}

/**
 * Compares two values using deep equality.
 *
 * This is useful when you need to verify structural equality of nested data.
 *
 * Primitive values are compared by value.
 * Arrays and objects are traversed recursively, so nested values must also be equal.
 * Functions are compared by reference.
 *
 * Examples:
 *
 * ```ts
 * deepEquals({ a: { x: 1 } }, { a: { x: 1 } }); // true
 * deepEquals([1, [2, 3]], [1, [2, 3]]); // true
 * deepEquals(() => 1, () => 1); // false
 * ```
 */
export function deepEquals(a: unknown, b: unknown): boolean {
    return deepEqual(a, b);
}
