// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { expect, it } from "vitest";
import { RovingMenuItemResult, useRovingMenuItem } from "./useRovingMenuItem";

it("throws by default when not surrounded by a menu parent", async () => {
    expect(() =>
        renderHook(
            (): RovingMenuItemResult =>
                useRovingMenuItem({
                    value: "foo"
                }),
            {
                wrapper: TestWrapper
            }
        )
    ).toThrowErrorMatchingInlineSnapshot(
        `[Error: Failed to find the outer menu. Is the menu item surrounded by the RovingMenuRoot?]`
    );
});

it("supports usage when not surrounded by a menu parent", async () => {
    const { result } = renderHook(
        (): RovingMenuItemResult | undefined =>
            useRovingMenuItem({
                value: "foo",
                required: false
            }),
        {
            wrapper: TestWrapper
        }
    );
    expect(result.current).toBe(undefined);
});

function TestWrapper(props: { children?: ReactNode }) {
    return <PackageContextProvider>{props.children}</PackageContextProvider>;
}
