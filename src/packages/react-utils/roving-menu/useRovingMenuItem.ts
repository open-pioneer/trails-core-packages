// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { FocusEventHandler, useContext, useEffect, useMemo } from "react";
import {
    getInternalState,
    InternalMenuState,
    MENU_OWNER_ATTR,
    MENU_VALUE_ATTR,
    MenuStateContext
} from "./RovingMenuState";

/**
 * Properties support when creating a new menu item via {@link useRovingMenuItem}.
 *
 * @group Roving menu
 */
export interface RovingMenuItemProps {
    /**
     * A unique value for the current item (in the context of this menu).
     */
    value: string;

    /**
     * Set this to true if your item is disabled.
     *
     * This tells the menu that the item cannot be focused.
     */
    disabled?: boolean;

    /**
     * By default, a menu item parent is required.
     *
     * Set this to `false` to make the parent optional.
     * The hook will become inactive and will return `undefined` if no parent is present.
     * This is useful for components that may or may not be used within a menu.
     *
     * Default: `true`
     */
    required?: boolean;
}

/**
 * The return value of {@link useRovingMenuItem}.
 *
 * @group Roving menu
 */
export interface RovingMenuItemResult {
    /**
     * DOM-Properties that must be applied to the menu item's dom element.
     *
     * Most importantly, this will apply the item's tab index and data attributes
     * that allow the menu to find the item in the DOM.
     *
     * Note that other properties may be added in a future release.
     */
    itemProps: {
        [MENU_OWNER_ATTR]: string;
        [MENU_VALUE_ATTR]: string;
        tabIndex: number;
        onFocus: FocusEventHandler;
        onBlur: FocusEventHandler;
    };
}

/**
 * Declares a new menu item using the given `props`.
 * @group Roving menu
 * @expandType RovingMenuItemProps
 */
export function useRovingMenuItem(
    props: RovingMenuItemProps & { required?: true }
): RovingMenuItemResult;
export function useRovingMenuItem(props: RovingMenuItemProps): RovingMenuItemResult | undefined;
export function useRovingMenuItem(props: RovingMenuItemProps): RovingMenuItemResult | undefined {
    const { value, disabled = false, required = true } = props;
    const state = useMenuState(required);

    useEffect(() => {
        if (!state || disabled) {
            return;
        }
        state.onItemMount(value);
        return () => state.onItemUnmount(value);
    }, [state, value, disabled]);

    const isActiveValue = useReactiveSnapshot(() => state?.isActive(value), [state, value]);
    const isActive = !disabled && isActiveValue;
    const result = useMemo((): RovingMenuItemResult | undefined => {
        if (!state) {
            return undefined;
        }
        const menuId = state.menuId;
        return {
            itemProps: {
                [MENU_OWNER_ATTR]: menuId,
                [MENU_VALUE_ATTR]: value,
                tabIndex: isActive ? 0 : -1,
                onFocus: (_event) => {
                    state?.onItemFocus(value);
                },
                onBlur: (_event) => {
                    state?.onItemBlur(value);
                }
            }
        };
    }, [state, value, isActive]);
    return result;
}

function useMenuState(required: boolean): InternalMenuState | undefined {
    const state = useContext(MenuStateContext);
    if (!state) {
        if (required) {
            throw new Error(
                "Failed to find the outer menu. Is the menu item surrounded by the RovingMenuRoot?"
            );
        }
        return undefined;
    }
    return getInternalState(state);
}
