// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box } from "@chakra-ui/react";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { RovingMenuRoot } from "./RovingMenuRoot";
import { useRovingMenu } from "./useRovingMenu";
import { useRovingMenuItem } from "./useRovingMenuItem";

let nextId = 1;
beforeEach(() => {
    nextId = 1;
});

vi.mock(import("react"), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        useId: () => {
            const ref = mod.useRef<string>(undefined);
            if (!ref.current) {
                ref.current = `r${nextId++}`;
            }
            return ref.current;
        }
    };
});

it("ensures that only one item can receive the keyboard focus", async () => {
    await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");
    expect(list.getAttribute("aria-orientation")).toBe("vertical");

    const items = Array.from(list.querySelectorAll("li"));
    expect(items.length).toBe(3);

    expect(items[0]).toMatchInlineSnapshot(`
      <li
        data-roving-menu-parent="r1"
        data-roving-menu-value="a"
        tabindex="0"
      >
        Item 
        a
      </li>
    `);

    expect(items[0]?.tabIndex).toBe(0);
    expect(items[1]?.tabIndex).toBe(-1);
    expect(items[2]?.tabIndex).toBe(-1);
});

it("works when items are not direct neighbors or immediate children of the menu", async () => {
    await render(<SimpleList wrapItems />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");
    expect(list).toMatchSnapshot();

    const items = Array.from(list.querySelectorAll("li"));
    expect(items[0]!.tabIndex).toBe(0);

    fireEvent.keyDown(list, { key: "ArrowDown" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(-1);
        expect(items[1]!.tabIndex).toBe(0);
    });
});

it("renders with horizontal orientation correctly", async () => {
    await render(<SimpleList orientation="horizontal" />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");
    expect(list.getAttribute("aria-orientation")).toBe("horizontal");

    const items = Array.from(list.querySelectorAll("li"));
    expect(items.length).toBe(3);
    expect(items[0]?.tabIndex).toBe(0);
    expect(items[1]?.tabIndex).toBe(-1);
    expect(items[2]?.tabIndex).toBe(-1);
});

it("handles keyboard navigation correctly in vertical orientation", async () => {
    await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");
    const items = Array.from(list.querySelectorAll("li"));

    // Initial state: first item has focus
    items[0]?.focus();
    expect(items[0]!.tabIndex).toBe(0);
    expect(items[1]!.tabIndex).toBe(-1);
    expect(items[2]!.tabIndex).toBe(-1);
    expect(items[0]).toHaveFocus();

    // Press down arrow - focus should move to second item
    fireEvent.keyDown(list, { key: "ArrowDown" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(-1);
        expect(items[1]!.tabIndex).toBe(0);
        expect(items[2]!.tabIndex).toBe(-1);

        expect(items[1]).toHaveFocus();
    });

    // Press down arrow again - focus should move to third item
    fireEvent.keyDown(list, { key: "ArrowDown" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(-1);
        expect(items[1]!.tabIndex).toBe(-1);
        expect(items[2]!.tabIndex).toBe(0);

        expect(items[2]).toHaveFocus();
    });

    // Press down arrow again - focus should wrap to first item
    fireEvent.keyDown(list, { key: "ArrowDown" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(0);
        expect(items[1]!.tabIndex).toBe(-1);
        expect(items[2]!.tabIndex).toBe(-1);

        expect(items[0]).toHaveFocus();
    });

    // Press up arrow - focus should wrap to third item
    fireEvent.keyDown(list, { key: "ArrowUp" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(-1);
        expect(items[1]!.tabIndex).toBe(-1);
        expect(items[2]!.tabIndex).toBe(0);

        expect(items[2]).toHaveFocus();
    });
});

it("handles home and end key navigation in vertical orientation", async () => {
    await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");
    const items = Array.from(list.querySelectorAll("li"));

    // Initial state: first item has focus
    items[0]?.focus();
    expect(items[0]!.tabIndex).toBe(0);
    expect(items[1]!.tabIndex).toBe(-1);
    expect(items[2]!.tabIndex).toBe(-1);
    expect(items[0]).toHaveFocus();

    // Press End key - focus should move to last item
    fireEvent.keyDown(list, { key: "End" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(-1);
        expect(items[1]!.tabIndex).toBe(-1);
        expect(items[2]!.tabIndex).toBe(0);

        expect(items[2]).toHaveFocus();
    });

    // Press Home key - focus should move to first item
    fireEvent.keyDown(list, { key: "Home" });
    await waitFor(() => {
        expect(items[0]!.tabIndex).toBe(0);
        expect(items[1]!.tabIndex).toBe(-1);
        expect(items[2]!.tabIndex).toBe(-1);

        expect(items[0]).toHaveFocus();
    });
});

it("switches active items if the active item is unmounted", async () => {
    const { rerender } = await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");

    const initialItems = Array.from(list.querySelectorAll("li"));
    expect(initialItems.map((item) => item.tabIndex)).toMatchInlineSnapshot(`
      [
        0,
        -1,
        -1,
      ]
    `);

    await rerender(<SimpleList values={["b", "c"]} />);
    await waitFor(() => {
        const updatedItems = Array.from(list.querySelectorAll("li"));
        expect(updatedItems.map((item) => item.tabIndex)).toEqual([0, -1]);
    });
});

it("switches active items if the last active item is unmounted", async () => {
    const { rerender } = await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");

    const initialItems = Array.from(list.querySelectorAll("li"));
    initialItems[2]?.focus();
    await waitFor(() => {
        expect(initialItems.map((item) => item.tabIndex)).toStrictEqual([-1, -1, 0]);
    });

    await rerender(<SimpleList values={["a", "b"]} />);
    await waitFor(() => {
        const updatedItems = Array.from(list.querySelectorAll("li"));
        expect(updatedItems.map((item) => item.tabIndex)).toEqual([-1, 0]);
    });
});

it("switches active items if the active item is disabled", async () => {
    const { rerender } = await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");

    const initialItems = Array.from(list.querySelectorAll("li"));
    expect(initialItems.map((item) => item.tabIndex)).toMatchInlineSnapshot(`
      [
        0,
        -1,
        -1,
      ]
    `);

    await rerender(<SimpleList disabledValues={["a"]} />);
    await waitFor(() => {
        const updatedItems = Array.from(list.querySelectorAll("li"));
        expect(updatedItems.map((item) => item.tabIndex)).toEqual([-1, 0, -1]);
    });
});

it("switches active items if the active item is hidden/unmounted", async () => {
    const { rerender } = await render(<SimpleList />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");

    const initialItems = Array.from(list.querySelectorAll("li"));
    expect(initialItems.map((item) => item.tabIndex)).toMatchInlineSnapshot(`
      [
        0,
        -1,
        -1,
      ]
    `);

    await rerender(<SimpleList hiddenValues={["a"]} />);
    await waitFor(() => {
        const updatedItems = Array.from(list.querySelectorAll("li"));
        // a is hidden, b becomes the active item
        expect(updatedItems.map((item) => item.tabIndex)).toEqual([0, -1]);
    });
});

it("is useable when the first menu item is disabled", async () => {
    await render(<SimpleList disabledValues={["a"]} />, {
        wrapper: TestWrapper
    });

    const list = await screen.findByRole("toolbar");
    const initialItems = Array.from(list.querySelectorAll("li"));

    // Second button gets the focus because the first one is disabled
    expect(initialItems.map((item) => item.tabIndex)).toMatchInlineSnapshot(`
      [
        -1,
        0,
        -1,
      ]
    `);
});

function SimpleList(props?: {
    orientation?: "horizontal" | "vertical";
    wrapItems?: boolean;
    values?: string[];
    disabledValues?: string[];
    hiddenValues?: string[];
}) {
    const { menuProps, menuState } = useRovingMenu({
        orientation: props?.orientation ?? "vertical"
    });

    const values = props?.values ?? ["a", "b", "c"];
    const disabledValues = props?.disabledValues ?? [];
    const hiddenValues = props?.hiddenValues ?? [];
    const items = values.map((v) => {
        let item = (
            <SimpleMenuItem
                key={!props?.wrapItems ? v : undefined}
                value={v}
                disabled={disabledValues.includes(v)}
                hidden={hiddenValues.includes(v)}
            />
        );
        if (props?.wrapItems) {
            item = (
                <Box className="wrapper-div" key={v}>
                    {item}
                </Box>
            );
        }
        return item;
    });

    return (
        <RovingMenuRoot menuState={menuState}>
            <ul {...menuProps}>{items}</ul>
        </RovingMenuRoot>
    );
}

function SimpleMenuItem(props: { value: string; disabled: boolean; hidden?: boolean }) {
    const { value, disabled, hidden } = props;
    const { itemProps } = useRovingMenuItem({ value, disabled: disabled || hidden });
    return hidden ? null : <li {...itemProps}>Item {value}</li>;
}

function TestWrapper(props: { children?: ReactNode }) {
    return <PackageContextProvider>{props.children}</PackageContextProvider>;
}
