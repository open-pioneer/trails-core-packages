// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
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

function SimpleList(props?: { orientation?: "horizontal" | "vertical"; values?: string[] }) {
    const { menuProps, menuState } = useRovingMenu({
        orientation: props?.orientation ?? "vertical"
    });

    const values = props?.values ?? ["a", "b", "c"];
    const items = values.map((v) => <SimpleMenuItem key={v} value={v} />);

    return (
        <RovingMenuRoot menuState={menuState}>
            <ul {...menuProps}>{items}</ul>
        </RovingMenuRoot>
    );
}

function SimpleMenuItem(props: { value: string }) {
    const value = props.value;
    const { itemProps } = useRovingMenuItem({ value });
    return <li {...itemProps}>Item {value}</li>;
}

function TestWrapper(props: { children?: ReactNode }) {
    return <PackageContextProvider>{props.children}</PackageContextProvider>;
}
