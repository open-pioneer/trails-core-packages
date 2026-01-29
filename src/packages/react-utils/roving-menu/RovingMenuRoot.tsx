// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { FC, memo, ReactNode } from "react";
import { RovingMenuState, MenuStateContext } from "./RovingMenuState";
import { type useRovingMenu } from "./useRovingMenu";

/**
 *
 * @group Roving menu
 */
export interface RovingMenuRootProps {
    /**
     * The menu state provided by {@link useRovingMenu}.
     */
    menuState: RovingMenuState;
    children?: ReactNode;
}

/**
 * This component must be the parent of all roving menu items.
 *
 * @group Roving menu
 * @expandType RovingMenuRootProps
 */
export const RovingMenuRoot: FC<RovingMenuRootProps> = memo(function RovingMenuRoot(
    props: RovingMenuRootProps
) {
    const { menuState, children } = props;
    return <MenuStateContext.Provider value={menuState}>{children}</MenuStateContext.Provider>;
});
