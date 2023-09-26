// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { extendTheme } from "@open-pioneer/chakra-integration";

/**
 * Base theme for open pioneer trails applications.
 *
 * All custom themes should extend this theme:
 *
 * ```ts
 * import { extendTheme } from "@open-pioneer/chakra-integration";
 * import { theme as baseTheme } from "@open-pioneer/base-theme";
 *
 * export const theme = extendTheme({
 *     // Your overrides
 * }, baseTheme);
 * ```
 *
 * NOTE: this API is still _experimental_.
 *
 * @experimental
 */
export const theme = extendTheme({});
