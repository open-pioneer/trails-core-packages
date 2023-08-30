// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
export const theme = {
    colors: {
        palegreen: {
            50: "#defffd",
            100: "#defffd",
            200: "#defffd",
            300: "#defffd",
            400: "#defffd",
            500: "#defffd",
            600: "#defffd",
            700: "#defffd",
            800: "#defffd",
            900: "#defffd"
        },
        myblack: {
            50: "#f2f2f2",
            100: "#d9d9d9",
            200: "#bfbfbf",
            300: "#a6a6a6",
            400: "#8c8c8c",
            500: "#737373",
            600: "#595959",
            700: "#404040",
            800: "#262626",
            900: "#0d0d0d"
        },
        mybrown: {
            50: "#feeded",
            100: "#e4d0d0",
            200: "#ccb2b2",
            300: "#b79494",
            400: "#a27676",
            500: "#885c5c",
            600: "#6a4747",
            700: "#4d3333",
            800: "#301d1d",
            900: "#170707"
        }
    },
    components: {
        Button: {
            defaultProps: {
                //only colorScheme, variant, size
                colorScheme: "palegreen" //default color must provided here
                //variant: "brown"
            },
            baseStyle: {
                fontWeight: "italic", // Normally, it is "semibold"
                bg: "red.500", //only applies if variant attribute is set
                color: "myblack.500"
            },
            variants: {
                brown: {
                    bg: "mybrown.500"
                }
            }
        }
    },
    semanticTokens: {
        colors: {
            error: {
                default: "red.500",
                _dark: "red.400"
            },
            success: "green.500"
        }
    }
};
