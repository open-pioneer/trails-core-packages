// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useContext } from "react";
import { InternalMenuState, MenuStateContext, getInternalState } from "./RovingMenuState";

export function useMenuState(): InternalMenuState;
export function useMenuState(required: true): InternalMenuState;
export function useMenuState(required: boolean): InternalMenuState | undefined;
export function useMenuState(required = true): InternalMenuState | undefined {
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
