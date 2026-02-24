// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { computed, reactive } from "@conterra/reactivity-core";
import { ColorModeValueSupplier, ColorModeValue, ThemeService } from "../api";
import { Resource, destroyResources } from "@open-pioneer/core";

const DEFAULT_INITIAL_COLOR_MODE: ColorModeValue = "light";
const ALLOWED_INITIAL_COLOR_MODES: Record<string, ColorModeValue> = {
    light: "light",
    dark: "dark"
};

export interface ThemeServiceProperties {
    initialColorMode?: string;
}

export class ThemeServiceImpl implements ThemeService {
    #source = reactive<ColorModeValueSupplier>(() => DEFAULT_INITIAL_COLOR_MODE);
    #colorMode = computed<ColorModeValue>(() => this.#source.value() ?? DEFAULT_INITIAL_COLOR_MODE);
    #cleanupHandles: Resource[] = [];

    constructor(properties: ThemeServiceProperties) {
        if (typeof properties?.initialColorMode === "string") {
            this.updateColorMode(
                ALLOWED_INITIAL_COLOR_MODES[properties.initialColorMode] ??
                    DEFAULT_INITIAL_COLOR_MODE
            );
        }
    }

    get colorMode(): ColorModeValue {
        return this.#colorMode.value;
    }

    updateColorMode(value: ColorModeValue | ColorModeValueSupplier): void {
        if (typeof value === "function") {
            this.#source.value = value;
        } else {
            this.#source.value = () => value;
        }
    }

    destroy(): void {
        destroyResources(this.#cleanupHandles);
        this.#cleanupHandles = [];
    }
}
