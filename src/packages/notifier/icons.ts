// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { LuCircleAlert, LuCircleCheck, LuInfo, LuTriangleAlert } from "react-icons/lu";

/**
 * The default icons used by the `Notifier` component.
 *
 * Usage:
 *
 * ```tsx
 * import { Icon } from "@chakra-ui/react";
 * import { defaultIcons } from "@open-pioneer/notifier";
 *
 * // Prefer `Icon` over raw svg because it automatically applies aria-hidden and also supports chakra's styling props.
 * <Icon as={defaultIcons.info} />
 * ```
 */
export const defaultIcons = Object.freeze({
    info: LuInfo,
    success: LuCircleCheck,
    warning: LuCircleAlert,
    error: LuTriangleAlert
} as const);
