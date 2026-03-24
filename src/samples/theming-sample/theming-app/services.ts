// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { DECLARE_SERVICE_INTERFACE, ServiceOptions, ThemeService } from "@open-pioneer/runtime";
import { config as trailsBaseTheme } from "@open-pioneer/base-theme";
import { mergeConfigs } from "@chakra-ui/react";
import { reactive } from "@conterra/reactivity-core";

export type ColorThemeName = "trails" | "red" | "blue" | "green";
const THEME_NAMES: ColorThemeName[] = ["trails", "red", "blue", "green"];

const _themeName = Symbol("themeName");

export class ColorThemes {
    [DECLARE_SERVICE_INTERFACE] = "theming.ColorThemes";
    #themeService: ThemeService;
    #currentTheme = reactive<ColorThemeName>("trails");
    constructor(opts: ServiceOptions<{ themeService: ThemeService }>) {
        this.#themeService = opts.references.themeService;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const iniitialTheme = this.#themeService.systemConfig as any;
        // lookup up color theme name (marked during theme update)
        const initialTheme = iniitialTheme?.[_themeName] ?? "trails";
        this.#currentTheme.value = initialTheme;
    }

    setColorTheme(theme: ColorThemeName) {
        const effectiveTheme = this._getEffectiveTheme(theme);
        // mark the effective theme with the name of the color theme for later retrieval
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (effectiveTheme as any)[_themeName] = theme;
        this.#themeService.setSystemConfig(effectiveTheme);
        this.#currentTheme.value = theme;
    }

    get availableColorThemes(): readonly ColorThemeName[] {
        return THEME_NAMES.slice();
    }

    get currentColorTheme(): ColorThemeName {
        return this.#currentTheme.value;
    }

    private _getEffectiveTheme(theme: ColorThemeName) {
        switch (theme) {
            case "trails":
                return mergeConfigs(trailsBaseTheme, {});
            case "red":
                return mergeConfigs(trailsBaseTheme, {
                    theme: {
                        tokens: {
                            colors: {
                                //11 colors as hex values from 50 to 950 (light to dark)
                                trails: {
                                    50: { value: "#fff5f5" },
                                    100: { value: "#fed7d7" },
                                    200: { value: "#feb2b2" },
                                    300: { value: "#fc8181" },
                                    400: { value: "#f56565" },
                                    500: { value: "#e53e3e" },
                                    600: { value: "#c53030" },
                                    700: { value: "#9b2c2c" },
                                    800: { value: "#822727" },
                                    900: { value: "#63171b" },
                                    950: { value: "#3d0f0f" }
                                }
                            }
                        }
                    }
                });
            case "blue":
                return mergeConfigs(trailsBaseTheme, {
                    theme: {
                        tokens: {
                            colors: {
                                //11 colors as hex values from 50 to 950 (light to dark)
                                trails: {
                                    50: { value: "#ebf8ff" },
                                    100: { value: "#bee3f8" },
                                    200: { value: "#90cdf4" },
                                    300: { value: "#63b3ed" },
                                    400: { value: "#4299e1" },
                                    500: { value: "#3182ce" },
                                    600: { value: "#2b6cb0" },
                                    700: { value: "#2c5282" },
                                    800: { value: "#2a4365" },
                                    900: { value: "#1a365d" },
                                    950: { value: "#0f2040" }
                                }
                            }
                        }
                    }
                });
            case "green":
                return mergeConfigs(trailsBaseTheme, {
                    theme: {
                        tokens: {
                            colors: {
                                //11 colors as hex values from 50 to 950 (light to dark)
                                trails: {
                                    50: { value: "#f0fff4" },
                                    100: { value: "#c6f6d5" },
                                    200: { value: "#9ae6b4" },
                                    300: { value: "#68d391" },
                                    400: { value: "#48bb78" },
                                    500: { value: "#38a169" },
                                    600: { value: "#276749" },
                                    700: { value: "#22543d" },
                                    800: { value: "#1c4532" },
                                    900: { value: "#133021" },
                                    950: { value: "#0a1f15" }
                                }
                            }
                        }
                    }
                });
        }
    }
}
