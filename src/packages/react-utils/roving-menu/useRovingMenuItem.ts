// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { FocusEventHandler, useLayoutEffect, useMemo, useRef } from "react";
import { MENU_OWNER_ATTR, MENU_VALUE_ATTR } from "./RovingMenuState";
import { useMenuState } from "./useMenuState";

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

/** @internal */
export interface RovingMenuItemDomProps {
    [MENU_OWNER_ATTR]: string;
    [MENU_VALUE_ATTR]: string;
    tabIndex: number;
    onFocus: FocusEventHandler;
    onBlur: FocusEventHandler;
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
    itemProps: RovingMenuItemDomProps;
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
    return useRovingMenuItemImpl(props, "item");
}

/**
 * @internal
 */
export function useRovingMenuItemImpl(
    props: RovingMenuItemProps & { required?: true },
    context: "item" | "nested"
): RovingMenuItemResult;
export function useRovingMenuItemImpl(
    props: RovingMenuItemProps,
    context: "item" | "nested"
): RovingMenuItemResult | undefined;
export function useRovingMenuItemImpl(
    props: RovingMenuItemProps,
    context: "item" | "nested"
): RovingMenuItemResult | undefined {
    const { value, disabled = false, required = true } = props;
    const state = useMenuState(required);

    const hasFocus = useRef(false);

    useLayoutEffect(() => {
        if (!state || disabled) {
            return;
        }
        state.onItemMount(value);
        return () => state.onItemUnmount(value, hasFocus.current);
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

                // items can be reached via user tab, nested menus can't
                tabIndex: context === "item" && isActive ? 0 : -1,

                onFocus: (_event) => {
                    hasFocus.current = true;
                    state?.onItemFocus(value);
                },
                onBlur: (_event) => {
                    hasFocus.current = false;
                }
            }
        };
    }, [state, value, isActive, context]);
    return result;
}
