// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from "@chakra-ui/react";
const fonts = {
    /* heading: "Tahoma",
    body: "Courier New" */
};

//10 colors as hex values from 50 to 900 (light to dark)
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

        /*  "chakra-body-text": "font_primary",
        "chakra-body-bg": "background_body",
        "chakra-border-color": "border", // todo?
        "chakra-placeholder-color": "placeholder" // todo? */
        //"chakra-inverse-text": "font_inverse",
        //"chakra-subtle-bg": "background_secondary",
        //"chakra-subtle-text": "font_secondary"
    }
};

//Get the color defined by a semantic token.
//If it points to a color (e.g. red.500), get the hex color value out of the color scheme.
//Overrides: "boxShadow" and "outline"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColor = (semanticToken: string, theme: any) => {
    const color = theme.semanticTokens.colors[semanticToken];
    if (color && color.includes(".")) {
        const kvp = color.split(".");
        const key = kvp[0],
            value = kvp[1];
        return theme.colors[key][value];
    }
    return color;
};

/**
 * Base theme for Open Pioneer Trails applications.
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
 */
// todo transfer old props: https://www.chakra-ui.com/docs/theming/overview#theme
const old_theme = {
    tokens: {
        colors: colorPalette
    },
    semanticTokens: semanticTokens,
    fonts: fonts,
    components: {
        Button: {
            defaultProps: {
                //colorScheme: "gray"
                //size: "md", //"lg" | "md" | "sm" | "xs"
                //variant: "solid" //"primary" | "secondary" | "cancel" | "solid" | "outline" | "ghost" | "link"
            }
        },
        Checkbox: {
            defaultProps: {
                //colorScheme: "blue"
                //size: "md" //"lg" | "md" | "sm"
            }
        },
        Divider: {
            baseStyle: {
                borderColor: "background_primary"
            }
        },
        Input: {
            defaultProps: {
                //size: "md" //"lg" | "md" | "sm" | "xs"
                //variant: "outline" //"outline" | "filled" | "flushed" | "unstyled"
            },
            variants: {
                /* outline({ theme }) {
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
                }, todo*/
                filled: {
                    field: {
                        _focusVisible: {
                            borderColor: "background_primary"
                        }
                    },
                    addon: {
                        bg: "background_primary"
                    }
                } /*,
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
                }todo */
            }
        },
        Link: {
            baseStyle: {
                color: "font_link"
            }
        },
        Radio: {
            defaultProps: {
                //colorScheme: "blue",
                //size: "md" //"lg" | "md" | "sm"
            }
        },
        /*    Select: {
            defaultProps: {
                //size: "md" //"lg" | "md" | "sm" | "xs"
                //variant: "outline" //"outline" | "filled" | "flushed" | "unstyled"
            },
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
        },tod */
        Slider: {
            defaultProps: {
                //colorScheme: "blue"
                //size: "md" //"lg" | "md" | "sm"
            },
            baseStyle: {
                thumb: {
                    borderColor: "background_primary",
                    _hover: {
                        bg: "background_primary"
                    }
                }
            }
        },
        Switch: {
            defaultProps: {
                //colorScheme: "blue",
                //size: "md" //"lg" | "md" | "sm"
            }
        },
        /*  Textarea: {
            defaultProps: {
                //size: "md", //"lg" | "md" | "sm" | "xs"
                //variant: "outline" //"outline" | "filled" | "flushed" | "unstyled"
            },
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
        },todo */
        Tooltip: {
            baseStyle: {
                //bg: "background_primary",
                //color: "font_inverse",
                borderRadius: "md"
            }
        }
    }
};

// todo docu
export const config = defineConfig({
    globalCss: { html: { colorPalette: "trails" } },
    theme: {
        tokens: {
            // todo typescript
            colors: colorPalette as any // eslint-disable-line @typescript-eslint/no-explicit-any
        },
        semanticTokens: semanticTokens
    }
});
