// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { mergeProps, SystemStyleObject } from "@chakra-ui/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

/**
 * Merges multiple `props` objects from left to right.
 *
 * This function works like Chakra's {@link mergeProps}, but has additional support for Chakra's `css` property.
 * If multiple `css` objects are defined, their values are combined into an array.
 * This way, multiple css rules may match and will not override each other.
 */
export function mergeChakraProps<T extends readonly Record<string, unknown>[]>(
    ...args: T
): Omit<UnionToIntersection<T[number]>, "css"> & { css?: SystemStyleObject | SystemStyleObject[] } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergedProps = mergeProps(...args) as Record<string, any>;

    // mergeProps handles plain html attributes only; merge chakra css on our own.
    let mergedCss: SystemStyleObject | SystemStyleObject[] | undefined;
    for (const props of args) {
        const localCss = props.css as SystemStyleObject | SystemStyleObject[] | undefined;
        if (!localCss || typeof localCss !== "object") {
            continue;
        }

        if (!mergedCss) {
            if (Array.isArray(localCss)) {
                mergedCss = [...localCss];
            } else {
                mergedCss = localCss;
            }
        } else if (!Array.isArray(mergedCss)) {
            mergedCss = [mergedCss, ...wrap(localCss)];
        } else {
            mergedCss.push(...wrap(localCss));
        }
    }
    if (mergedCss) {
        mergedProps.css = mergedCss;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mergedProps as any;
}

function wrap<T>(v: T | T[]): T[] {
    if (Array.isArray(v)) {
        return v;
    }
    return [v];
}
