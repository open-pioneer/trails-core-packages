// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from "@chakra-ui/react";
import { radioGroupAnatomy, sliderAnatomy, checkboxAnatomy } from "@chakra-ui/react/anatomy";

//11 colors as hex values from 50 to 950 (light to dark)
export const colorPalette = {
    //trails = default color scheme
    trails: {
        50: { value: "#eaf2f5" },
        100: { value: "#d5e5ec" },
        200: { value: "#abcbd9" },
        300: { value: "#81b1c5" },
        400: { value: "#5797b2" },
        500: { value: "#2d7d9f" },
        600: { value: "#24647f" },
        700: { value: "#1b4b5f" },
        800: { value: "#123240" },
        900: { value: "#091920" },
        950: { value: "#050505" }
    }
};

const semanticTokens = {
    colors: {
        // define semantic tokens to allow usage of `colorPalette` property in components
        // see: https://chakra-ui.com/docs/theming/customization/colors#color-palette
        trails: {
            solid: { value: "{colors.trails.500}" },
            contrast: { value: "{colors.white}" },
            fg: { value: "{colors.trails.700}" },
            muted: { value: "{colors.trails.100}" },
            subtle: { value: "{colors.trails.50}" },
            emphasized: { value: "{colors.trails.300}" },
            focusRing: { value: "{colors.trails.500}" }
        },

        // define custom semantic tokens
        trails_background_body: { value: "{colors.white}" },
        trails_background_primary: { value: "{colors.trails.500}" },
        trails_background_light: { value: "{colors.trails.50}" },
        //background_secondary: { value: "{colors.trails.700}"},
        trails_placeholder: { value: "{colors.red.500}" },
        trails_font_primary: { value: "{colors.black}" },
        //font_secondary: { value: "{colors.gray.500}"},
        trails_font_inverse: { value: "{colors.white}" },
        trails_font_link: { value: "{colors.trails.600}" },
        trails_border: { value: "{colors.gray.300}" },

        // override chakra internal semantic tokens
        //https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/semantic-tokens/colors.ts
        // examples:
        fg: {
            DEFAULT: {
                value: "{colors.trails_font_primary}"
            }
        },
        bg: {
            DEFAULT: {
                value: "{colors.trails_background_body}"
            },
            muted: {
                value: "{colors.trails_background_light}"
            }
        },
        border: {
            DEFAULT: {
                value: "{colors.trails_border}"
            }
        }

        // "chakra-placeholder-color": "trails_placeholder" // todo: change placeholder color; token does not longer exist; overwriting globalCss ::placeholder does not work: https://chakra-ui.com/docs/theming/customization/global-css#example
    }
};

// Change style of components
// see https://chakra-ui.com/docs/theming/customization/recipes#recipes
const recipes = {
    separator: {
        base: {
            borderColor: "trails_background_primary"
        }
    },
    button: {
        variants: {
            variant: {
                solid: {
                    _hover: {
                        bg: "colorPalette.700"
                    }
                },
                outline: {
                    borderColor: "colorPalette.solid"
                }
            }
        }
    },
    inputAddon: {
        variants: {
            variant: {
                outline: {
                    bg: "colorPalette.solid"
                },
                subtle: {
                    bg: "colorPalette.solid"
                }
            }
        }
    },
    heading: {
        variants: {
            size: {
                xs: { textStyle: "sm" },
                sm: { textStyle: "md" },
                md: { textStyle: "xl" },
                lg: { textStyle: "2xl" },
                xl: { textStyle: "3xl" },
                "2xl": { textStyle: "4xl" },
                "3xl": { textStyle: "5xl" },
                "4xl": { textStyle: "6xl" },
                "5xl": { textStyle: "7xl" },
                "6xl": { textStyle: "8xl" },
                "7xl": { textStyle: "9xl" }
            }
        }
    }
};

// Change style of multipart components
// see https://chakra-ui.com/docs/theming/customization/recipes#slot-recipes
const slotRecipes = {
    checkbox: {
        slots: checkboxAnatomy.keys(),
        base: {
            control: {
                // only change the border color for invalid state
                _invalid: {
                    colorPalette: "trails",
                    borderColor: "red",
                    borderWidth: "2px",
                    "&:is([data-state=checked], [data-state=indeterminate])": {
                        borderColor: "red"
                    }
                },
                cursor: "pointer"
            }
        },
        variants: {
            // reduce size for backwarts compatibility
            size: {
                xs: {
                    root: { gap: "1.5" },
                    label: { textStyle: "xs" },
                    control: {
                        boxSize: "2"
                    }
                },
                sm: {
                    root: { gap: "2" },
                    label: { textStyle: "sm" },
                    control: {
                        boxSize: "3"
                    }
                },
                md: {
                    root: { gap: "2.5" },
                    label: { textStyle: "sm" },
                    control: {
                        boxSize: "4",
                        p: "0.2"
                    }
                },
                lg: {
                    root: { gap: "3" },
                    label: { textStyle: "md" },
                    control: {
                        boxSize: "5",
                        p: "0.2"
                    }
                }
            }
        }
    },
    radioGroup: {
        slots: radioGroupAnatomy.keys(),
        base: {
            itemControl: {
                // only change the border color for invalid state
                _invalid: {
                    colorPalette: "trails",
                    borderColor: "red",
                    borderWidth: "2px",
                    "&:is([data-state=checked], [data-state=indeterminate])": {
                        borderColor: "red"
                    }
                },
                cursor: "pointer"
            }
        },
        variants: {
            // reduce size for backwarts compatibility
            size: {
                xs: {
                    item: { textStyle: "xs", gap: "1.5" },
                    itemControl: {
                        boxSize: "2"
                    }
                },
                sm: {
                    item: { textStyle: "sm", gap: "2" },
                    itemControl: {
                        boxSize: "3"
                    }
                },
                md: {
                    item: { textStyle: "sm", gap: "2.5" },
                    itemControl: {
                        boxSize: "4"
                    }
                },
                lg: {
                    item: { textStyle: "md", gap: "3" },
                    itemControl: {
                        boxSize: "5"
                    }
                }
            }
        }
    },
    slider: {
        slots: sliderAnatomy.keys(),
        base: {
            control: {
                cursor: "pointer"
            },
            thumb: {
                _hover: {
                    bg: "colorPalette.solid"
                }
            }
        },
        variants: {
            // reduce size for backwarts compatibility
            size: {
                sm: {
                    root: {
                        "--slider-thumb-size": "sizes.2.5",
                        "--slider-track-size": "sizes.0.5"
                    }
                },
                md: {
                    root: {
                        "--slider-thumb-size": "sizes.3.5",
                        "--slider-track-size": "sizes.1"
                    }
                },
                lg: {
                    root: {
                        "--slider-thumb-size": "sizes.4",
                        "--slider-track-size": "sizes.1"
                    }
                }
            }
        }
    }
};

/**
 * Base theme for Open Pioneer Trails applications.
 *
 * All custom themes should extend this theme:
 *
 * ```ts
 * import { mergeConfigs } from "@chakra-ui/react";
 * import { config as defaultTrailsConfig } from "@open-pioneer/base-theme";
 *
 * export const themeConfig = mergeConfigs(defaultTrailsConfig, {
 *     // Your overrides
 * });
 * ```
 */
// Todo mouse cursor is not chaning on hover (checkbox, radio, slider)
export const config = defineConfig({
    globalCss: {
        html: { colorPalette: "trails" }
    },
    theme: {
        tokens: {
            colors: colorPalette
        },
        semanticTokens: semanticTokens,
        recipes: recipes,
        slotRecipes: slotRecipes
    }
});

// TODO Add typscript support? https://www.chakra-ui.com/docs/theming/tokens#using-tokens
//  The CLI can be used to generate TypeScript types for your theme tokens and variants.
//  By default the CLI will overwrite the existing types in the node modules folder of the chakra react package. It is possible to provide another path to save the types to by using the --output flag. However, we need to find a way to transport these types to the users.
//  Another problem ist, that the CLI requires the config file to have a default export of the SystemContext (createSystem) and not just the SystemConfig.
//  If we do not add typescript support, the trails specific semanticTokens will not be present in the ts suggestion (but no error, as type is string). However, if providing new variants, ts will throw an error if the variant does not exist in the theme.
