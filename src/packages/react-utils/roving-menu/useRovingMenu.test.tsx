// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box } from "@chakra-ui/react";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RovingMenuRoot } from "./RovingMenuRoot";
import { useNestedRovingMenu, useRovingMenu } from "./useRovingMenu";
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

describe("nested menus", () => {
    it("inner items are not in the tab order before the sub-menu is entered", async () => {
        await render(<SimpleParentMenu />, { wrapper: TestWrapper });

        const parentMenu = await screen.findByTestId("parent-menu");
        const nestedMenu = await screen.findByTestId("nested-menu");
        const beforeItem = parentMenu.querySelector<HTMLElement>(
            '[data-roving-menu-value="before"]'
        )!;

        // First item has tabIndex 0, all others -1
        expect(beforeItem.tabIndex).toBe(0);
        expect(nestedMenu.tabIndex).toBe(-1);
        const innerItems = Array.from(nestedMenu.querySelectorAll("li"));
        expect(innerItems.every((item) => item.tabIndex === -1)).toBe(true);
    });

    it("navigating into the sub-menu forwards focus to its active inner item", async () => {
        await render(<SimpleParentMenu />, { wrapper: TestWrapper });

        const parentMenu = await screen.findByTestId("parent-menu");
        const beforeItem = parentMenu.querySelector<HTMLElement>(
            '[data-roving-menu-value="before"]'
        )!;
        beforeItem.focus();

        fireEvent.keyDown(parentMenu, { key: "ArrowDown" });
        await waitFor(() => {
            const xItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="x"]')!;
            expect(xItem).toHaveFocus();
            expect(xItem.tabIndex).toBe(0);
            expect(beforeItem.tabIndex).toBe(-1);
        });
    });

    it("keys matching sub-menu orientation navigate within the sub-menu", async () => {
        await render(<SimpleParentMenu />, { wrapper: TestWrapper });

        const parentMenu = await screen.findByTestId("parent-menu");
        const nestedMenu = await screen.findByTestId("nested-menu");
        const xItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="x"]')!;
        const yItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="y"]')!;
        const zItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="z"]')!;

        // Navigate into the nested sub-menu
        parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="before"]')!.focus();
        fireEvent.keyDown(parentMenu, { key: "ArrowDown" });
        await waitFor(() => expect(xItem).toHaveFocus());

        fireEvent.keyDown(nestedMenu, { key: "ArrowRight" });
        await waitFor(() => {
            expect(yItem).toHaveFocus();
            expect(yItem.tabIndex).toBe(0);
            expect(xItem.tabIndex).toBe(-1);
        });

        fireEvent.keyDown(nestedMenu, { key: "ArrowRight" });
        await waitFor(() => expect(zItem).toHaveFocus());

        // Wrap around
        fireEvent.keyDown(nestedMenu, { key: "ArrowRight" });
        await waitFor(() => expect(xItem).toHaveFocus());

        // Wrap around the other way
        fireEvent.keyDown(nestedMenu, { key: "ArrowLeft" });
        await waitFor(() => expect(zItem).toHaveFocus());
    });

    it("keys matching parent orientation navigate to the next parent item", async () => {
        await render(<SimpleParentMenu />, { wrapper: TestWrapper });

        const parentMenu = await screen.findByTestId("parent-menu");
        const nestedMenu = await screen.findByTestId("nested-menu");
        const xItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="x"]')!;
        const afterItem = parentMenu.querySelector<HTMLElement>(
            '[data-roving-menu-value="after"]'
        )!;

        xItem.focus();
        await waitFor(() => {
            expect(xItem.tabIndex).toBe(0);
        });

        // ArrowDown (parent's axis) from within the nested sub-menu → moves focus to "after" in parent
        fireEvent.keyDown(nestedMenu, { key: "ArrowDown" });
        await waitFor(() => {
            expect(afterItem).toHaveFocus();
            expect(afterItem.tabIndex).toBe(0);
            expect(xItem.tabIndex).toBe(-1);
        });
    });

    it("focus returns to the last active inner item when re-entering the sub-menu", async () => {
        await render(<SimpleParentMenu />, { wrapper: TestWrapper });

        const parentMenu = await screen.findByTestId("parent-menu");
        const nestedMenu = await screen.findByTestId("nested-menu");
        const xItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="x"]')!;
        const yItem = parentMenu.querySelector<HTMLElement>('[data-roving-menu-value="y"]')!;
        const afterItem = parentMenu.querySelector<HTMLElement>(
            '[data-roving-menu-value="after"]'
        )!;

        xItem.focus();
        fireEvent.keyDown(nestedMenu, { key: "ArrowRight" });
        await waitFor(() => expect(yItem).toHaveFocus());

        // Leave the nested sub-menu
        fireEvent.keyDown(nestedMenu, { key: "ArrowDown" });
        await waitFor(() => expect(afterItem).toHaveFocus());

        // Navigate back into the nested sub-menu – should restore focus to y, not reset to x
        fireEvent.keyDown(parentMenu, { key: "ArrowUp" });
        await waitFor(() => {
            expect(yItem).toHaveFocus();
            expect(yItem.tabIndex).toBe(0);
        });
    });

    it("sub-menu element itself receives focus when all inner items are disabled", async () => {
        await render(<SimpleParentMenu disabledInnerValues={["x", "y", "z"]} />, {
            wrapper: TestWrapper
        });

        const parentMenu = await screen.findByTestId("parent-menu");
        const nestedMenu = await screen.findByTestId("nested-menu");
        const beforeItem = parentMenu.querySelector<HTMLElement>(
            '[data-roving-menu-value="before"]'
        )!;
        const afterItem = parentMenu.querySelector<HTMLElement>(
            '[data-roving-menu-value="after"]'
        )!;

        beforeItem.focus();

        // Submenu is focused because all children are disabled.
        // NOTE: Could be improved - empty menus could be skipped.
        // Should be fine for now, though.
        fireEvent.keyDown(parentMenu, { key: "ArrowDown" });
        await waitFor(() => {
            expect(nestedMenu).toHaveFocus();
        });

        fireEvent.keyDown(parentMenu, { key: "ArrowDown" });
        await waitFor(() => {
            expect(afterItem).toHaveFocus();
        });
    });
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

function SimpleParentMenu(props?: { disabledInnerValues?: string[] }) {
    const { menuProps, menuState } = useRovingMenu({ orientation: "vertical" });
    return (
        <RovingMenuRoot menuState={menuState}>
            <ul {...menuProps} data-testid="parent-menu">
                <SimpleMenuItem value="before" />
                <SimpleNestedMenu value="nested" disabledValues={props?.disabledInnerValues} />
                <SimpleMenuItem value="after" />
            </ul>
        </RovingMenuRoot>
    );
}

function SimpleNestedMenu(props: { value: string; disabledValues?: string[] }) {
    const { value, disabledValues = [] } = props;
    const { menuProps, menuState } = useNestedRovingMenu({ orientation: "horizontal", value });
    return (
        <RovingMenuRoot menuState={menuState}>
            <div {...menuProps} data-testid="nested-menu">
                <SimpleMenuItem value="x" disabled={disabledValues.includes("x")} />
                <SimpleMenuItem value="y" disabled={disabledValues.includes("y")} />
                <SimpleMenuItem value="z" disabled={disabledValues.includes("z")} />
            </div>
        </RovingMenuRoot>
    );
}

function SimpleMenuItem(props: { value: string; disabled?: boolean; hidden?: boolean }) {
    const { value, disabled, hidden } = props;
    const { itemProps } = useRovingMenuItem({ value, disabled: disabled || hidden });
    return hidden ? null : <li {...itemProps}>Item {value}</li>;
}

function TestWrapper(props: { children?: ReactNode }) {
    return <PackageContextProvider>{props.children}</PackageContextProvider>;
}
