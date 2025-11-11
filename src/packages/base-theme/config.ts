// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineConfig, SystemConfig } from "@chakra-ui/react";
import {
    radioGroupAnatomy,
    sliderAnatomy,
    checkboxAnatomy,
    selectAnatomy,
    nativeSelectAnatomy
} from "@chakra-ui/react/anatomy";

// Not exported by chakra
type ThemingConfig = NonNullable<SystemConfig["theme"]>;
type TokenDefinition = NonNullable<ThemingConfig["tokens"]>;
type SemanticTokenDefinition = NonNullable<ThemingConfig["semanticTokens"]>;
type RecipeDefinition = NonNullable<ThemingConfig["recipes"]>[string];
type SlotRecipeConfig = NonNullable<ThemingConfig["slotRecipes"]>[string];

const tokens: TokenDefinition = {
    colors: {
        //11 colors as hex values from 50 to 950 (light to dark)
        // trails = default color scheme
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
    }
};

const semanticTokens: SemanticTokenDefinition = {
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
        trails_placeholder: { value: "{colors.gray.700}" },

        // .600 has no enough contrast, .700 is too dark
        // https://github.com/open-pioneer/trails-openlayers-base-packages/issues/450
        orange: {
            solid: { value: "#D2460F" }
        },
        green: {
            solid: { value: "{colors.green.700}" }
        },
        red: {
            solid: { value: "{colors.red.700}" }
        },

        // overwrite chakra internal semantic tokens
        //https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/semantic-tokens/colors.ts
        fg: {
            DEFAULT: {
                value: "{colors.black}"
            }
        },
        bg: {
            DEFAULT: {
                value: "{colors.white}"
            },
            muted: {
                value: "{colors.trails.50}"
            }
        },
        border: {
            DEFAULT: {
                value: "{colors.gray.300}"
            }
        }
    }
};

// Change style of components
// see https://chakra-ui.com/docs/theming/customization/recipes#recipes
const recipes: Record<string, RecipeDefinition> = {
    separator: {
        base: {
            borderColor: "colorPalette.solid"
        }
    },
    button: {
        variants: {
            variant: {
                solid: {
                    _hover: {
                        bg: "colorPalette.700"
                    },
                    _pressed: {
                        bg: "colorPalette.800"
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
const slotRecipes: Record<string, SlotRecipeConfig> = {
    checkbox: {
        slots: checkboxAnatomy.keys(),
        base: {
            root: {
                cursor: "pointer",
                _disabled: {
                    cursor: "not-allowed"
                }
            },
            control: {
                // only change the border color for invalid state
                _invalid: {
                    colorPalette: "trails",
                    borderColor: "red",
                    borderWidth: "2px",
                    "&:is([data-state=checked], [data-state=indeterminate])": {
                        borderColor: "red"
                    }
                }
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
            item: {
                cursor: "pointer"
            },
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
    select: {
        slots: selectAnatomy.keys(),
        base: {
            trigger: {
                cursor: "pointer"
            }
        }
    },
    nativeSelect: {
        slots: nativeSelectAnatomy.keys(),
        base: {
            field: {
                cursor: "pointer"
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
 * Base chakra system config for Open Pioneer Trails applications.
 *
 * This configures the default color palette, the `trails` color scheme, etc.
 *
 * All custom chakra configs should extend this config:
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
export const config = defineConfig({
    // change default color palette to "trails" color palette
    // see https://www.chakra-ui.com/guides/theming-change-default-color-palette
    globalCss: {
        html: { colorPalette: "trails" },
        "*::placeholder": {
            opacity: 1,
            color: "trails_placeholder"
        }
    },
    theme: {
        tokens,
        semanticTokens,
        recipes,
        slotRecipes
    }
});
