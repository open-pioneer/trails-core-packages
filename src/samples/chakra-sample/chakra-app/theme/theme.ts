// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { mergeConfigs } from "@chakra-ui/react";
import { config as defaultTrailsConfig } from "@open-pioneer/base-theme";

export const themeConfig = mergeConfigs(defaultTrailsConfig, {
    globalCss: { html: { colorPalette: "primary" } },
    theme: {
        tokens: {
            colors: {
                primary: {
                    50: "#defffd",
                    100: "#b3fffa",
                    200: "#86feee",
                    300: "#61fbdc",
                    400: "#3efec9",
                    500: "#32e5a6",
                    600: "#23b277",
                    700: "#147f4c",
                    800: "#004d23",
                    900: "#001b0a",
                    950: "#000b06"
                } as any // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        },
        semanticTokens: {
            colors: {
                primary: {
                    solid: { value: "{colors.primary.500}" },
                    contrast: { value: "{colors.primary.100}" },
                    fg: { value: "{colors.primary.700}" },
                    muted: { value: "{colors.primary.100}" },
                    subtle: { value: "{colors.primary.200}" },
                    emphasized: { value: "{colors.primary.300}" },
                    focusRing: { value: "{colors.primary.500}" }
                }
            }
        }
    }
});

// todo migrate all properties
/*export const theme = extendTheme(
    {
        colors: {
            primary: {
                50: "#defffd",
                100: "#b3fffa",
                200: "#86feee",
                300: "#5bfedd",
                400: "#3efec9",
                500: "#32e5a6",
                600: "#23b277",
                700: "#147f4c",
                800: "#004d23",
                900: "#001b0a"
            }
        },
        fonts: {
            heading: "Helvetica"
        },
        components: {
            Button: {
                defaultProps: {
                    colorScheme: "primary"
                },
                variants: {
                    cancel: {
                        color: "font_inverse",
                        bg: "error",
                        _hover: { backgroundColor: "error_hover" }
                    }
                }
            },
            Link: {
                baseStyle: {
                    color: "font_link"
                }
            },
            Divider: {
                baseStyle: {
                    borderColor: "border"
                }
            }
        },
        semanticTokens: {
            colors: {
                "background_primary": "primary.300",
                "background_secondary": "primary.500",
                "placeholder": "primary.100",
                "font_primary": "black",
                "font_secondary": "grey.500",
                "font_inverse": "white",
                "font_link": "yellow.300",
                "border": "black",
                "error": "red.500",
                "error_hover": "red.600",
                "success": "green.500",
                "highlight": "yellow.300",

                // override internal chakra theming variables
                "chakra-body-bg": "background_primary",
                "chakra-subtle-bg": "background_secondary",
                "chakra-body-text": "font_primary",
                "chakra-subtle-text": "font_secondary",
                "chakra-inverse-text": "font_inverse",
                "chakra-border-color": "border",
                "chakra-placeholder-color": "placeholder"
            }
        }
    },
    baseTheme
);*/
