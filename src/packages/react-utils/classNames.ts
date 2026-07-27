// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

export type ClassValue =
    string | number | boolean | null | undefined | ClassDictionary | ClassValue[];
export interface ClassDictionary {
    [key: string]: unknown;
}

/**
 * Joins arguments into a single string.
 * Accepts strings, numbers, arrays and plain objects (recursively).
 * For objects, each key is included when its value is true.
 */
export function classNames(...args: ClassValue[]): string {
    const parts: string[] = [];
    for (const arg of args) {
        if (!arg) {
            continue;
        }
        if (typeof arg === "string" || typeof arg === "number") {
            parts.push(String(arg));
        } else if (Array.isArray(arg)) {
            const inner = classNames(...arg);
            if (inner) {
                parts.push(inner);
            }
        } else if (typeof arg === "object") {
            for (const key of Object.keys(arg)) {
                // only include keys with truthy values
                if (arg[key]) {
                    parts.push(key);
                }
            }
        }
    }
    return parts.join(" ");
}
