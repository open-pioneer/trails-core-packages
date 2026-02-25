// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { computed, reactive } from "@conterra/reactivity-core";
import {
    type ColorModeValueSupplier,
    type ColorModeValue,
    type ThemeService,
    type ChakraSystemConfigSupplier
} from "../api";
import { type SystemConfig as ChakraSystemConfig } from "@chakra-ui/react";

export const DEFAULT_INITIAL_COLOR_MODE: ColorModeValue = "light";
const ALLOWED_INITIAL_COLOR_MODES: Record<string, ColorModeValue> = {
    light: "light",
    dark: "dark"
};

export interface ThemeServiceProperties {
    initialColorMode?: string;
    initialChakraSystemConfig?: ChakraSystemConfig;
}

export class ThemeServiceImpl implements ThemeService {
    #source = reactive<ColorModeValueSupplier>(() => DEFAULT_INITIAL_COLOR_MODE);
    #colorMode = computed<ColorModeValue>(() => this.#source.value() ?? DEFAULT_INITIAL_COLOR_MODE);
    #systemConfigSource = reactive<ChakraSystemConfigSupplier>(() => undefined);
    #systemConfig = computed<ChakraSystemConfig | undefined>(
        () => this.#systemConfigSource.value() ?? undefined
    );

    constructor(properties: ThemeServiceProperties) {
        if (typeof properties?.initialColorMode === "string") {
            this.updateColorMode(
                ALLOWED_INITIAL_COLOR_MODES[properties.initialColorMode] ??
                    DEFAULT_INITIAL_COLOR_MODE
            );
        }
        if (properties?.initialChakraSystemConfig) {
            this.updateSystemConfig(properties.initialChakraSystemConfig);
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

    get chakraSystemConfig(): ChakraSystemConfig | undefined {
        return this.#systemConfig.value;
    }

    updateSystemConfig(value: ChakraSystemConfig | ChakraSystemConfigSupplier | undefined): void {
        if (typeof value === "function") {
            this.#systemConfigSource.value = value;
        } else {
            this.#systemConfigSource.value = () => value;
        }
    }
}
