// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from "@chakra-ui/react";

//11 colors as hex values from 50 to 950 (light to dark)
export const colorPalette = {
    //trails = default color scheme
    trails: {
        50: "#eaf2f5",
        100: "#d5e5ec",
        200: "#abcbd9",
        300: "#81b1c5",
        400: "#5797b2",
        500: "#2d7d9f",
        600: "#24647f",
        700: "#1b4b5f",
        800: "#123240",
        900: "#091920",
        950: "#050505"
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

// todo transfer old props:
//  components to recipes -> recipes for components are linked at the top of the docu page of each component
/*const old_theme = {
    components: {
      
       
        Slider: {
            baseStyle: {
                thumb: {
                    borderColor: "trails_background_primary",
                    _hover: {
                        bg: "trails_background_primary"
                    }
                }
            }
        },
        Textarea: {
            variants: {
                outline({ theme }: StyleFunctionProps) {
                    return {
                        borderColor: "trails_border",
                        _focusVisible: {
                            borderColor: "trails_background_primary",
                            boxShadow: `0 0 0 1px ${getColor("trails_background_primary", theme)}`
                        }
                    };
                },
                filled: {
                    _focusVisible: {
                        borderColor: "trails_background_primary"
                    }
                },
                flushed({ theme }: StyleFunctionProps) {
                    return {
                        _focusVisible: {
                            borderColor: "trails_background_primary",
                            boxShadow: `0px 1px 0px 0px ${getColor("trails_background_primary", theme)}`
                        }
                    };
                }
            }
        },
        Tooltip: {
            baseStyle: {
                borderRadius: "md"
            }
        }
    }
};*/

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
// todo typscript support? https://www.chakra-ui.com/docs/theming/tokens#using-tokens
export const config = defineConfig({
    globalCss: {
        html: { colorPalette: "trails" }
    },
    theme: {
        tokens: {
            // todo typescript
            colors: colorPalette as any // eslint-disable-line @typescript-eslint/no-explicit-any
        },
        semanticTokens: semanticTokens,
        recipes: {
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
            slider: {} // todo hover color of the handle
        }
    }
});
