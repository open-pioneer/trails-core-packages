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
    #current = reactive<string | undefined>();

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

    get current(): string | undefined {
        return this.#current.value;
    }

    isActive(value: string): boolean {
        return this.current === value;
    }

    /**
     * Called when a key is pressed on the menu root element.
     */
    onKeyDown(event: KeyboardEvent): void {
        const direction = getNavDirection(event, this.orientation);
        if (!direction) {
            return;
        }

        const items = getFocusableItems(this.#menuRef, this.menuId);
        const target = getFocusTarget(items, this.current, direction);
        if (!target) {
            LOG.warn("Failed to identify focus target for keyboard navigation");
            return;
        }

        event.preventDefault();
        this.#navigateToItem(target);
        target.focus();
    }

    /**
     * Called by items when they mount.
     *
     * This will activate the first item to ensure that at least one item is focusable.
     */
    onItemMount(value: string): void {
        if (!this.current) {
            this.#activateItem(value);
        }
    }

    /**
     * Called by items when they unmount.
     *
     * This will move the active value to another item to ensure that one item is focusable.
     */
    onItemUnmount(value: string): void {
        if (this.isActive(value)) {
            const items = getFocusableItems(this.#menuRef, this.menuId, true);
            const target = items[0];
            target && this.#navigateToItem(target);
        }
    }

    /**
     * Called by items when they become disabled.
     *
     * This will move the active value to another item to ensure that one item is focusable.
     */
    onItemDisabled(value: string): void {
        // improvement: don't reset to first but to a close item instead
        this.onItemUnmount(value); // happens to do what we want :)
    }

    /**
     * Called by items when they receive focus.
     *
     * This is redundant when using arrow key navigation, but its important if
     * the item receives focus from the outside (e.g. programmatically) to sync it
     * with the menu's state.
     */
    onItemFocus(value: string): void {
        this.#activateItem(value);
    }

    #navigateToItem(target: HTMLElement) {
        const value = getItemValue(target);
        if (!value) {
            LOG.warn("Menu item without a value", value);
            return;
        }

        this.#activateItem(value);
    }

    #activateItem(value: string): void {
        this.#current.value = value;
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

function getFocusTarget(
    items: HTMLElement[],
    current: string | undefined,
    direction: NavDirection
): HTMLElement | undefined {
    const currentIndex = items.findIndex((item) => getItemValue(item) === current);
    if (currentIndex === -1) {
        // Some keyboard event from an unknown child?
        return items.at(0);
    }

    if (direction === "home") {
        return items.at(0);
    }
    if (direction === "end") {
        return items.at(-1);
    }

    let nextIndex;
    if (direction === "forward") {
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
            nextIndex = 0;
        }
    } else {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
            nextIndex = items.length - 1;
        }
    }
    return items.at(nextIndex);
}

function getFocusableItems(
    menuRef: RefObject<HTMLElement | null>,
    menuId: string,
    unmount = false
): HTMLElement[] {
    const owner = menuRef.current;
    if (!owner) {
        if (unmount) {
            // List may no longer be in the DOM
            return [];
        } else {
            throw new Error("Menu not found in DOM. Was the 'id' attribute set correctly?");
        }
    }

    const escapedId = CSS.escape(menuId);
    const children = owner.querySelectorAll(`[${MENU_OWNER_ATTR}=${escapedId}]:not([disabled])`);
    return Array.from(children) as HTMLElement[];
}

function getItemValue(item: HTMLElement | undefined): string | undefined {
    return item?.dataset[MENU_VALUE_JS] ?? undefined;
}
