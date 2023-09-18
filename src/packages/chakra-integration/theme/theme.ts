// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { theme as baseTheme, extendTheme } from "@chakra-ui/react";

/**
 * Base theme for open pioneer trails applications.
 *
 * All custom themes should extend this theme:
 *
 * ```ts
 * import { theme as baseTheme, extendTheme } from "@open-pioneer/chakra-integration";
 *
 * export const theme = extendTheme({
 *     // Your overrides
 * }, baseTheme);
 * ```
 *
 * NOTE: this API is still _experimental_. The base theme is likely to move into a different package.
 *
 * @experimental
 */
export const theme = extendTheme(
    {
        styles: {
            //add global css styles here
            global: {
                // Apply the same styles to the application root node that chakra would usually apply to the html and body.
                ".chakra-host":
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (baseTheme.styles.global as Record<string, any>).body
            }
        },
        colors: {
            //define colors and color schemes here/
            /*primary: {
            50: "#defffd",
            100: "#b3fffa",
            200: "#86feee",
            300: "#5bfedd",
            400: "#3efec9",
            500: "#32e5a6",
            600: "#23b277",                                               
            700: "#147f4c",
            800: "#004d23",
            900: "#001b0a",
        } */
        },
        components: {
            //define component specific styling here
            /*Button: {
            defaultProps: {
                colorScheme: "primary"
            }*/
        },
        semanticTokens: {
            //define sematinc tokens here
            /*colors: {
            background_primary: "primary.300",
            background_secondary: "primary.500",
        }*/
        }
    },
    baseTheme
);
