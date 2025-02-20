// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    StyleFunctionProps,
    extendTheme,
    withDefaultColorScheme,
    theme as baseTheme
} from "@open-pioneer/chakra-integration";

const fonts = {
    /* heading: "Tahoma",
    body: "Courier New" */
};

//10 colors as hex values from 50 to 900 (light to dark)
const colors = {
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
        900: "#091920"
    }
};

const semanticTokens = {
    colors: {
        "background_body": "white",
        "background_primary": "trails.500",
        "background_light": "trails.50",
        //"background_secondary": "trails.700",
        "placeholder": "gray.500",
        "font_primary": "black",
        //"font_secondary": "gray.500",
        "font_inverse": "white",
        "font_link": "trails.600",
        "border": "gray.300",

        //override internal chakra theming variables
        //https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/theme/src/semantic-tokens.ts
        "chakra-body-text": "font_primary",
        "chakra-body-bg": "background_body",
        "chakra-border-color": "border",
        "chakra-placeholder-color": "placeholder"
        //"chakra-inverse-text": "font_inverse",
        //"chakra-subtle-bg": "background_secondary",
        //"chakra-subtle-text": "font_secondary"
    }
};

//Create an intermediate theme to have access to all colors and semantic tokens (function: getColor)
const intermediateTheme = extendTheme({ fonts, colors, semanticTokens }, baseTheme);

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
export const theme = extendTheme(
    withDefaultColorScheme({ colorScheme: "trails" }),
    {
        styles: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            global({ theme }: any) {
                return {
                    ".chakra-host": {
                        //TODO: Hack! Additional Hex digits only work because colors are hex, too
                        //opacity-to-hex: 0.6 => 99
                        "--trails-theme-shadow-color": `${getColor("background_primary", theme)}99`
                    }
                };
            }
        },
        shadows: {
            outline: `0 0 0 3px var(--trails-theme-shadow-color)`
        },
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
                    outline({ theme }: StyleFunctionProps) {
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
            Select: {
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
            },
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
            Textarea: {
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
                                boxShadow: `0px 1px 0px 0px ${getColor(
                                    "background_primary",
                                    theme
                                )}`
                            }
                        };
                    }
                }
            },
            Tooltip: {
                baseStyle: {
                    //bg: "background_primary",
                    //color: "font_inverse",
                    borderRadius: "md"
                }
            }
        }
    },
    intermediateTheme
);
