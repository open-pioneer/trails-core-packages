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
        trails: {
            solid: { value: "{colors.trails.500}" },
            contrast: { value: "{colors.trails.100}" },
            fg: { value: "{colors.trails.700}" },
            muted: { value: "{colors.trails.100}" },
            subtle: { value: "{colors.trails.200}" },
            emphasized: { value: "{colors.trails.300}" },
            focusRing: { value: "{colors.trails.500}" }
        },
        background_body: { value: "{colors.white}" },
        background_primary: { value: "{colors.trails.500}" },
        background_light: { value: "{colors.trails.50}" },
        //background_secondary: { value: "{colors.trails.70}0"},
        placeholder: { value: "{colors.gray.500}" },
        font_primary: { value: "{colors.black}" },
        //font_secondary: { value: "{colors.gray.50}0"},
        font_inverse: { value: "{colors.white}" },
        font_link: { value: "{colors.trails.600}" },
        border: { value: "{colors.gray.300}" },

        //override internal chakra theming variables
        //https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/semantic-tokens/colors.ts
        // examples:
        fg: {
            DEFAULT: {
                value: "{colors.font_primary}"
            }
        },
        bg: {
            DEFAULT: {
                value: "{colors.background_body}"
            }
        }

        /*
        "chakra-border-color": "border", // todo?
        "chakra-placeholder-color": "placeholder" // todo? */
    }
};

// todo transfer old props:
//  components to recipes -> recipes for components are linked at the top of the docu page of each component
/*const old_theme = {
    components: {
        Input: {
            variants: {
                outline({ theme }) {
                    return {
                        field: {
                            borderColor: "border",
                            _focusVisible: {
                                borderColor: "background_primary",
                                boxShadow: `0 0 0 1px ${getColor("background_primary", theme)}`
                            }
                        },
                        addon: {
                            borderColor: "border",
                            bg: "background_primary"
                        }
                    };
                },
                filled: {
                    field: {
                        _focusVisible: {
                            borderColor: "background_primary"
                        }
                    },
                    addon: {
                        bg: "background_primary"
                    }
                },
                flushed({ theme }) {
                    return {
                        field: {
                            _focusVisible: {
                                borderColor: "background_primary",
                                boxShadow: `0px 1px 0px 0px ${getColor(
                                    "background_primary",
                                    theme
                                )}`
                            }
                        }
                    };
                }
            }
        },
        Link: {
            baseStyle: {
                color: "font_link"
            }
        },
        Select: {
            variants: {
                outline({ theme }: StyleFunctionProps) {
                    return {
                        field: {
                            borderColor: "border",
                            _focusVisible: {
                                borderColor: "background_primary",
                                boxShadow: `0 0 0 1px ${getColor("background_primary", theme)}`
                            }
                        }
                    };
                },
                filled: {
                    field: {
                        _focusVisible: {
                            borderColor: "background_primary"
                        }
                    },
                    addon: {
                        bg: "background_primary"
                    }
                },
                flushed({ theme }: StyleFunctionProps) {
                    return {
                        field: {
                            _focusVisible: {
                                borderColor: "background_primary",
                                boxShadow: `0px 1px 0px 0px ${getColor(
                                    "background_primary",
                                    theme
                                )}`
                            }
                        }
                    };
                }
            }
        },
        Slider: {
            baseStyle: {
                thumb: {
                    borderColor: "background_primary",
                    _hover: {
                        bg: "background_primary"
                    }
                }
            }
        },
        Textarea: {
            variants: {
                outline({ theme }: StyleFunctionProps) {
                    return {
                        borderColor: "border",
                        _focusVisible: {
                            borderColor: "background_primary",
                            boxShadow: `0 0 0 1px ${getColor("background_primary", theme)}`
                        }
                    };
                },
                filled: {
                    _focusVisible: {
                        borderColor: "background_primary"
                    }
                },
                flushed({ theme }: StyleFunctionProps) {
                    return {
                        _focusVisible: {
                            borderColor: "background_primary",
                            boxShadow: `0px 1px 0px 0px ${getColor("background_primary", theme)}`
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
    globalCss: { html: { colorPalette: "trails" } },
    theme: {
        tokens: {
            // todo typescript
            colors: colorPalette as any // eslint-disable-line @typescript-eslint/no-explicit-any
        },
        semanticTokens: semanticTokens,
        recipes: {
            separator: {
                base: {
                    borderColor: "background_primary"
                }
            }
        }
    }
});
