// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { useCommonComponentProps } from "./useCommonComponentProps";
import { renderHook } from "@testing-library/react";

it("supports className and data-testid", () => {
    const hook = renderHook(() =>
        useCommonComponentProps("foo", {
            "className": "bar",
            "data-testid": "1234"
        })
    );

    // className merged with primary class
    expect(hook.result.current.containerProps).toMatchInlineSnapshot(`
      {
        "className": "foo bar",
        "data-testid": "1234",
      }
    `);
});

it("allows for arbitrary aria attributes", () => {
    const hook = renderHook(() =>
        useCommonComponentProps("foo", {
            "role": "button",
            "aria-activedescendant": "1234",
            "aria-valuemax": 9999
        })
    );

    expect(hook.result.current.containerProps).toMatchInlineSnapshot(`
      {
        "aria-activedescendant": "1234",
        "aria-valuemax": 9999,
        "className": "foo",
        "role": "button",
      }
    `);
});

it("allows for arbitrary data attributes", () => {
    const hook = renderHook(() =>
        useCommonComponentProps("foo", {
            "data-foo": 123,
            "data-bar": {
                hello: "world"
            }
        })
    );

    expect(hook.result.current.containerProps).toMatchInlineSnapshot(`
      {
        "className": "foo",
        "data-bar": {
          "hello": "world",
        },
        "data-foo": 123,
      }
    `);
});

it("supports css property", () => {
    const hook = renderHook(() =>
        useCommonComponentProps("foo", {
            css: {
                background: "colorPalette.solid"
            }
        })
    );

    expect(hook.result.current.containerProps).toMatchInlineSnapshot(`
      {
        "className": "foo",
        "css": {
          "background": "colorPalette.solid",
        },
      }
    `);
});

it("does not copy other attributes", () => {
    const hook = renderHook(() =>
        useCommonComponentProps("foo", {
            "whatever": "123",
            "onClick": () => undefined
        } as any)
    );

    expect(hook.result.current.containerProps).toMatchInlineSnapshot(`
      {
        "className": "foo",
      }
    `);
});
