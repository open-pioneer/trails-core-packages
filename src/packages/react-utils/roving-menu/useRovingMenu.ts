// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ApplicationContext } from "@open-pioneer/runtime";
import { useService } from "open-pioneer:react-hooks";
import { KeyboardEvent, useId, useMemo } from "react";
import { useEvent } from "../useEvent";
import { type RovingMenuRoot } from "./RovingMenuRoot";
import { InternalMenuState, RovingMenuState } from "./RovingMenuState";

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
        id: string;
        role: string;
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
    //TODO: can we avoid this lookup? and simple e.g. go up the parents?
    const ctx = useService<ApplicationContext>("runtime.ApplicationContext");

    const menuId = useId();

    // Shared state between items and root
    const state = useMemo(
        () => new InternalMenuState(menuId, orientation, ctx.getApplicationContainer()),
        [ctx, orientation, menuId]
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
                id: menuId,
                role: "toolbar",
                "aria-orientation": orientation,
                onKeyDown: onKeyDown
            },
            menuState: state as unknown as RovingMenuState
        }),
        [menuId, orientation, onKeyDown, state]
    );
    return result;
}
