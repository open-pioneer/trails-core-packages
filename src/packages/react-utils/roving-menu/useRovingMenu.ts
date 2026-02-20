// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { KeyboardEvent, FocusEvent, RefObject, useCallback, useId, useMemo, useRef } from "react";
import { useEvent } from "../useEvent";
import { type RovingMenuRoot } from "./RovingMenuRoot";
import { InternalMenuState, MENU_ID_ATTR, RovingMenuState } from "./RovingMenuState";
import { RovingMenuItemDomProps, useRovingMenuItemImpl } from "./useRovingMenuItem";
import { useMenuState } from "./useMenuState";

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

/** @internal */
export interface RovingMenuDomProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: RefObject<any>;
    role: string;
    tabIndex: number;
    [MENU_ID_ATTR]: string;
    "aria-orientation": "horizontal" | "vertical";
    onKeyDown: (event: KeyboardEvent) => void;
    onFocus: (event: FocusEvent) => void;
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
    menuProps: RovingMenuDomProps;

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
    return useRovingMenuImpl(props);
}

/**
 * Properties supported when creating a new nested menu via {@link useNestedRovingMenu}.
 *
 * @group Roving menu
 */
export interface NestedRovingMenuProps extends RovingMenuProps {
    /**
     * The value of the menu within its parent menu.
     */
    value: string;
}

/**
 * The return value of {@link useNestedRovingMenu}.
 *
 * @group Roving menu
 */
export interface NestedRovingMenuResult extends RovingMenuResult {
    menuProps: RovingMenuDomProps & RovingMenuItemDomProps;
}

/**
 * Like {@link useRovingMenu}, but suitable for nested menus.
 *
 * Only a single level of nested is supported at this time (i.e. horizontal in vertical, or the other way around).
 *
 * @group Roving menu
 * @expandType NestedRovingMenuProps
 */
export function useNestedRovingMenu(props: NestedRovingMenuProps): NestedRovingMenuResult {
    const parentMenuState = useMenuState();
    const { menuProps, menuState } = useRovingMenuImpl(
        props,
        useCallback(() => parentMenuState.isActive(props.value), [parentMenuState, props.value])
    );
    const { itemProps } = useRovingMenuItemImpl(props, "nested");

    return useMemo(() => {
        return {
            menuProps: {
                ...menuProps,
                ...itemProps,
                onFocus(e: FocusEvent) {
                    // Tracks active state in parent
                    itemProps.onFocus(e);

                    // Focuses the correct child
                    menuProps.onFocus(e);
                }
            },
            menuState
        };
    }, [menuProps, menuState, itemProps]);
}

function useRovingMenuImpl(
    props: RovingMenuProps = {},
    isActiveInParent?: () => boolean
): RovingMenuResult {
    const { orientation = "horizontal" } = props;
    const menuId = useId();
    const menuRef = useRef<HTMLElement>(null);

    // Shared state between items and root
    const state = useMemo(
        () => new InternalMenuState(menuId, orientation, menuRef, isActiveInParent),
        [menuRef, orientation, menuId, isActiveInParent]
    );

    const onKeyDown = useEvent((event: KeyboardEvent) => {
        state.onKeyDown(event);
    });
    const onFocus = useEvent((event: FocusEvent) => {
        state.onFocus(event);
    });
    const result = useMemo(
        (): RovingMenuResult => ({
            menuProps: {
                ref: menuRef,
                role: "toolbar",
                "aria-orientation": orientation,
                tabIndex: -1,
                [MENU_ID_ATTR]: menuId,
                onKeyDown,
                onFocus
            },
            menuState: state as unknown as RovingMenuState
        }),
        [menuId, orientation, onKeyDown, onFocus, state]
    );
    return result;
}
