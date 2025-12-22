// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useEvent } from "./useEvent";
import { useInsertionEffect } from "react";

it("provides a stable handler function", () => {
    const hook = renderHook(
        (fn: () => number) => {
            return useEvent(fn);
        },
        {
            initialProps: () => 123
        }
    );

    const stableFn = hook.result.current;
    expect(typeof stableFn).toBe("function");
    expect(stableFn()).toBe(123);

    hook.rerender(() => 456);
    expect(hook.result.current).toBe(stableFn);
    expect(stableFn()).toBe(456);
});

it("is available in useInsertionEffect", () => {
    const spy = vi.fn();
    const _hook = renderHook(
        (fn: () => void) => {
            const stableFn = useEvent(fn);

            // Must not throw
            useInsertionEffect(stableFn);
        },
        {
            initialProps: spy
        }
    );
    expect(spy).toHaveBeenCalled();
});
