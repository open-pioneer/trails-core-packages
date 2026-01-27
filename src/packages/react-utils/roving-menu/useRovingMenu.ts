// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { KeyboardEvent, RefObject, useId, useMemo, useRef } from "react";
import { useEvent } from "../useEvent";
import { type RovingMenuRoot } from "./RovingMenuRoot";
import { InternalMenuState, MENU_ID_ATTR, RovingMenuState } from "./RovingMenuState";

/**
 * Properties supported when creating a new menu via {@link useRovingMenu}.
 *
 * @group Roving menu
 */
export interface RovingMenuProps {
    /**
     * Configures the orientation of the menu (default: `horizontal`).
     *
     * Horizontal menus can be navigated using left/right, vertical menus use up/down.
     */
    orientation?: "vertical" | "horizontal";
}

/**
 * The return value of {@link useRovingMenu}.
 *
 * @group Roving menu
 */
export interface RovingMenuResult {
    /**
     * DOM-Properties that must be applied to the menu's dom element.
     *
     * Note that other properties may be added in a future release.
     */
    menuProps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref: RefObject<any>;
        role: string;
        [MENU_ID_ATTR]: string;
        "aria-orientation": "horizontal" | "vertical";
        onKeyDown: (event: KeyboardEvent) => void;
    };

    /**
     * Properties that should be passed to the {@link RovingMenuRoot}.
     *
     * The specific internals of this object are an implementation detail.
     */
    menuState: RovingMenuState;
}

/**
 * The roving menu is a render-less component for lists that support keyboard navigation.
 * It implements the basics for an accessible, keyboard navigable menu using the "roving tab index" pattern.
 *
 * Items can be navigated using arrow keys and home/end keys.
 *
 * @group Roving menu
 * @expandType RovingMenuProps
 */
export function useRovingMenu(props: RovingMenuProps = {}): RovingMenuResult {
    const { orientation = "horizontal" } = props;
    const menuId = useId();
    const menuRef = useRef<HTMLElement>(null);

    // Shared state between items and root
    const state = useMemo(
        () => new InternalMenuState(menuId, orientation, menuRef),
        [menuRef, orientation, menuId]
    );

    // Key handler on the menu
    const onKeyDown = useEvent((event: KeyboardEvent) => {
        if (event.defaultPrevented) {
            return;
        }

        state.onKeyDown(event);
    });

    const result = useMemo(
        (): RovingMenuResult => ({
            menuProps: {
                ref: menuRef,
                role: "toolbar",
                "aria-orientation": orientation,
                [MENU_ID_ATTR]: menuId,
                onKeyDown: onKeyDown
            },
            menuState: state as unknown as RovingMenuState
        }),
        [menuId, orientation, onKeyDown, state]
    );
    return result;
}
