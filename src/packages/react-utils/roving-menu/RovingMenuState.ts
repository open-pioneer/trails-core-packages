// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { createLogger } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { createContext, KeyboardEvent, RefObject } from "react";

const LOG = createLogger(sourceId);

// Mostly for debugging parent/child links. Not used for lookups.
export const MENU_ID_ATTR = "data-roving-menu-id";

// Children of the menu have this attribute to signal which menu they belong to.
export const MENU_OWNER_ATTR = "data-roving-menu-parent";

// Children of the menu use this as their unique id (in the context of the menu).
export const MENU_VALUE_ATTR = "data-roving-menu-value";

// Same as above, but for access via node.dataset
export const MENU_VALUE_JS = "rovingMenuValue";

/**
 * Shared context for Menu <--> MenuItem coordination.
 *
 * @internal
 */
export const MenuStateContext = createContext<RovingMenuState | undefined>(undefined);

declare const MENU_STATE_BRAND: unique symbol;

/**
 * The menu state represents the internal state of the menu.
 *
 * The internals are currently hidden.
 *
 * @group Roving menu
 */
export interface RovingMenuState {
    [MENU_STATE_BRAND]: void;
}

/**
 * Checked cast for the internal menu state.
 * @internal
 */
export function getInternalState(menuState: RovingMenuState): InternalMenuState {
    if (!(menuState instanceof InternalMenuState)) {
        throw new Error("Invalid menu state.");
    }
    return menuState as unknown as InternalMenuState;
}

/**
 * Internal model class; created by the menu and accessible by the menu items.
 *
 * @internal
 */
export class InternalMenuState {
    #menuRef: RefObject<HTMLElement | null>;
    #current = reactive<
        | {
              // value
              id: string;
              // whether the item has focus or not. This is used to determine whether focus should be restored to the item when navigating within the menu, or if it should be allowed to move freely.
              hasFocus: boolean;
              // The index at all available menu items, as the item becomes active or focused.
              // This is used to restore the focus if the item becomes unmounted while focused and is not longer available in the dom.
              index: number;
          }
        | undefined
    >();

    readonly menuId: string;
    readonly orientation: "horizontal" | "vertical";

    constructor(
        menuId: string,
        orientation: "horizontal" | "vertical",
        menuRef: RefObject<HTMLElement | null>
    ) {
        this.#menuRef = menuRef;
        this.menuId = menuId;
        this.orientation = orientation;
    }

    private get currentValue(): string | undefined {
        return this.#current.value?.id;
    }

    isActive(value: string): boolean {
        return this.currentValue === value;
    }

    /**
     * Called when a key is pressed on the menu root element.
     */
    onKeyDown(event: KeyboardEvent): void {
        const direction = getNavDirection(event, this.orientation);
        if (!direction) {
            return;
        }

        const items = getMenuItems(this.#menuRef, this.menuId);
        const target = getFocusTarget(items, this.currentValue, direction);
        if (!target) {
            LOG.warn("Failed to identify focus target for keyboard navigation");
            return;
        }

        event.preventDefault();
        this.#navigateToItem(target.el, target.index);
        target.el.focus();
    }

    /**
     * Called by items when they mount.
     *
     * This will activate the first item to ensure that at least one item is focusable.
     */
    onItemMount(value: string): void {
        if (!this.#current.value) {
            this.#activateItem(value);
        } else {
            // Update the index of the current value to allow restoring focus to the correct position if it becomes unavailable.
            this.#updateCurrentValueIndex();
        }
    }

    /**
     * Called by items when they unmount.
     * Also used to handle the case when an item becomes disabled while focused.
     *
     * This will move the active value to another item to ensure that one item is focusable.
     */
    onItemUnmount(value: string): void {
        if (!this.isActive(value)) {
            // Update the index of the current value to allow restoring focus to the correct position if it becomes unavailable, in case the unmounted item is before the current item in the dom.
            this.#updateCurrentValueIndex();
            return;
        }
        this.#navigateToNextFocusableItem();
    }

    /**
     * Called by items when they receive focus.
     *
     * This is redundant when using arrow key navigation, but its important if
     * the item receives focus from the outside (e.g. programmatically) to sync it
     * with the menu's state.
     */
    onItemFocus(value: string): void {
        this.#activateItem(value, undefined, true);
    }

    /** Called by items when they lose focus.
     * This will deactivate the item, but only if it is currently active. This allows the menu to stay in sync if an item becomes disabled while focused, but won't interfere with normal focus changes within the menu.
     */
    onItemBlur(value: string): void {
        if (this.isActive(value)) {
            this.#activateItem(value, undefined, false);
        }
    }

    #updateCurrentValueIndex(): void {
        const current = this.#current.value;
        if (!current) {
            return;
        }
        const items = getMenuItems(this.#menuRef, this.menuId, true);
        const index = findItemIndex(items, current.id);
        if (index === -1) {
            // Current item is no longer in the dom.
            // This can happen when an item becomes disabled while focused and is removed from the tab order using aria-disabled or similar.
            this.#activateItem(undefined);
        } else {
            // Update the index of the current value to allow restoring focus to the correct position if it becomes unavailable.
            // do not update the value, the index is internal state change, which should not be reactive
            current.index = index;
        }
    }

    #navigateToNextFocusableItem(): void {
        const {
            id: currentValue,
            hasFocus: currentHasFocus,
            index: currentIndex
        } = this.#current.value ?? {
            id: undefined,
            hasFocus: false,
            index: -1
        };
        if (!currentValue) {
            return;
        }
        const items = getMenuItems(this.#menuRef, this.menuId, true, false);
        const target = findTargetToActivate(currentValue, currentIndex, items);
        if (target) {
            this.#navigateToItem(target.el, target.index);
            if (currentHasFocus) {
                LOG.debug("Restoring focus within menu to", target);
                requestAnimationFrame(() => target.el.focus());
            }
            return;
        }
        this.#activateItem(undefined);
    }

    #navigateToItem(target: HTMLElement, index: number) {
        const value = getItemValue(target);
        if (!value) {
            LOG.warn("Menu item without a value", value);
            return;
        }
        this.#activateItem(value, index);
    }

    #activateItem(
        value: string | undefined,
        // undefined -> do not update, -1 -> try to correct index, >-1 use index
        index?: number | undefined,
        // undefined -> do not update, true -> has focus, false -> does not have focus
        hasFocus?: boolean | undefined
    ): void {
        const current = this.#current.value;
        if (value === undefined) {
            this.#current.value = undefined;
            return;
        }
        if (current?.id === value) {
            if (hasFocus !== undefined) {
                current.hasFocus = hasFocus;
            }
            if (index === undefined) {
                return;
            }
            if (index > -1) {
                current.index = index;
            } else {
                this.#updateCurrentValueIndex();
            }
            return;
        }
        index = index ?? -1;
        // active state change
        this.#current.value = { id: value, hasFocus: hasFocus ?? false, index };
        if (index === -1) {
            this.#updateCurrentValueIndex();
        }
    }
}

type NavDirection = "backward" | "forward" | "home" | "end";

function getNavDirection(
    event: KeyboardEvent,
    orientation: "horizontal" | "vertical"
): NavDirection | undefined {
    switch (event.key) {
        case "ArrowUp": {
            if (orientation === "vertical") {
                return "backward";
            }
            break;
        }
        case "ArrowDown": {
            if (orientation === "vertical") {
                return "forward";
            }
            break;
        }
        case "ArrowLeft": {
            if (orientation === "horizontal") {
                return "backward";
            }
            break;
        }
        case "ArrowRight": {
            if (orientation === "horizontal") {
                return "forward";
            }
            break;
        }
        case "Home":
            return "home";
        case "End":
            return "end";
    }
}

function findTargetToActivate(currentValue: string, disabledIndex: number, items: HTMLElement[]) {
    if (disabledIndex === -1) {
        return getFocusTarget(items, -1, "home");
    }
    // check if el on old index is a new element (e.g. first focused item is unmounted
    const el = items[disabledIndex];
    // use same postion if other value and not disabled
    if (el && getItemValue(el) !== currentValue && !isDisabled(el)) {
        return { el, index: disabledIndex };
    }
    // Attempt to move focus to something sensible
    // NOTE: focus change requires not using 'disabled' but 'aria-disabled' instead
    return (
        getFocusTarget(items, disabledIndex, "forward", false) ??
        getFocusTarget(items, disabledIndex, "backward", false)
    );
}

function getFocusTarget(
    items: HTMLElement[],
    current: string | number | undefined,
    direction: NavDirection,
    wrap = true
): { el: HTMLElement; index: number } | undefined {
    if (items.length === 0) {
        return undefined;
    }
    let currentIndex = -1;
    if (typeof current === "number") {
        currentIndex = current;
    } else if (typeof current === "string") {
        currentIndex = findItemIndex(items, current);
    }

    if (currentIndex === -1 || direction === "home") {
        const index = items.findIndex((item) => !isDisabled(item));
        const el = items[index];
        if (index === -1 || !el) {
            return undefined;
        }
        return { el, index };
    }
    if (direction === "end") {
        const index = items.findLastIndex((item) => !isDisabled(item));
        const el = items[index];
        if (index === -1 || !el) {
            return undefined;
        }
        return { el, index };
    }

    if (direction === "forward") {
        for (let nextIndex = currentIndex + 1; ; ) {
            if (nextIndex >= items.length) {
                if (!wrap) {
                    break;
                }

                nextIndex = 0;
            }
            if (nextIndex === currentIndex) {
                break;
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const item = items[nextIndex]!;
            if (!isDisabled(item)) {
                return { el: item, index: nextIndex };
            }
            nextIndex += 1;
        }
    } else {
        for (let nextIndex = currentIndex - 1; ; ) {
            if (nextIndex < 0) {
                if (!wrap) {
                    break;
                }
                nextIndex = items.length - 1;
            }
            if (nextIndex === currentIndex) {
                break;
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const item = items[nextIndex]!;
            if (!isDisabled(item)) {
                return { el: item, index: nextIndex };
            }
            nextIndex -= 1;
        }
    }
    return undefined;
}

function findItemIndex(items: HTMLElement[], value: string) {
    return items.findIndex((item) => getItemValue(item) === value);
}

function getMenuItems(
    menuRef: RefObject<HTMLElement | null>,
    menuId: string,
    unmount = false,
    excludeDisabled = true
): HTMLElement[] {
    const owner = menuRef.current;
    if (!owner) {
        if (unmount) {
            // List may no longer be in the DOM
            return [];
        } else {
            throw new Error(
                "Menu parent not found in DOM. Was the 'ref' prop applied correctly to the container?"
            );
        }
    }

    const escapedId = CSS.escape(menuId);
    let selector = `[${MENU_OWNER_ATTR}=${escapedId}]`;
    if (excludeDisabled) {
        selector += ":not([disabled],[aria-disabled='true'])";
    }
    const children = owner.querySelectorAll(selector);
    return Array.from(children) as HTMLElement[];
}

function getItemValue(item: HTMLElement | undefined): string | undefined {
    return item?.dataset[MENU_VALUE_JS] ?? undefined;
}

function isDisabled(item: HTMLElement): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(item as any).disabled || item.ariaDisabled === "true";
}
