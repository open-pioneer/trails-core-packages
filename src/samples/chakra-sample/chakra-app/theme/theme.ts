// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { mergeConfigs } from "@chakra-ui/react";
import { config as defaultTrailsConfig } from "@open-pioneer/base-theme";

// todo update documentation in starter repo how to do a custom theme that extends the base theme
// - Use mergeConfigs to merge the base theme with your custom theme (instead of extendTheme)
// - to override the default color palette, define a new color palette in the theme color config,
// and then use the new color palette in the semantic token config to allow usage of `colorPalette`property in components
// and set the globalCss html colorPalette to the new color palette
// - to not use the trails base theme as a base, use defineConfig instead of mergeConfigs

export const themeConfig = mergeConfigs(defaultTrailsConfig, {
    // change default color palette to "trails" color palette
    // see https://www.chakra-ui.com/guides/theming-change-default-color-palette
    globalCss: { html: { colorPalette: "primary" } },
    theme: {
        tokens: {
            colors: {
                // define color palette for color scheme
                primary: {
                    50: { value: "#defffd" },
                    100: { value: "#b3fffa" },
                    200: { value: "#86feee" },
                    300: { value: "#61fbdc" },
                    400: { value: "#3efec9" },
                    500: { value: "#32e5a6" },
                    600: { value: "#23b277" },
                    700: { value: "#147f4c" },
                    800: { value: "#004d23" },
                    900: { value: "#001b0a" },
                    950: { value: "#000b06" }
                }
            }
        },
        semanticTokens: {
            colors: {
                // define semantic tokens to allow usage of `colorPalette` property in components
                // see: https://chakra-ui.com/docs/theming/customization/colors#color-palette
                primary: {
                    solid: { value: "{colors.primary.500}" },
                    contrast: { value: "{colors.white}" },
                    fg: { value: "{colors.primary.700}" },
                    muted: { value: "{colors.primary.100}" },
                    subtle: { value: "{colors.primary.50}" },
                    emphasized: { value: "{colors.primary.300}" },
                    focusRing: { value: "{colors.primary.500}" }
                },

                // define custom semantic tokens
                primary_background_primary: { value: "{colors.primary.300}" },
                primary_background_light: { value: "{colors.primary.50}" },
                primary_background_secondary: { value: "{colors.primary.500}" },
                primary_placeholder: { value: "{colors.gray.500}" },
                primary_font_primary: { value: "{colors.black}" },
                primary_font_secondary: { value: "{colors.gray.500}" },
                primary_font_inverse: { value: "{colors.white}" },
                primary_font_link: { value: "{colors.yellow.300}" },
                primary_border: { value: "{colors.black}" },

                // override chakra internal semantic tokens
                //https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/semantic-tokens/colors.ts
                fg: {
                    DEFAULT: {
                        value: "{colors.primary_font_primary}"
                    },
                    subtle: {
                        value: "{colors.primary_font_secondary}"
                    },
                    inverted: {
                        value: "{colors.primary_font_inverse}"
                    }
                },
                bg: {
                    DEFAULT: {
                        value: "{colors.primary_background_primary}"
                    },
                    muted: {
                        value: "{colors.primary_background_light}"
                    }
                },
                border: {
                    DEFAULT: {
                        value: "{colors.primary_border}"
                    }
                }
            }
        },
        // Change style of components
        // see https://chakra-ui.com/docs/theming/customization/recipes#recipes
        recipes: {
            link: {
                variants: {
                    variant: {
                        plain: {
                            color: "primary_font_link"
                        }
                    }
                }
            }
        }
    }
});
