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

export interface ThemeServiceProperties {
    initialColorMode?: ColorModeValue;
    initialChakraSystemConfig?: ChakraSystemConfig;
}

export class ThemeServiceImpl implements ThemeService {
    #colorModeSource = reactive<ColorModeValueSupplier>(() => DEFAULT_INITIAL_COLOR_MODE);
    #colorMode = computed<ColorModeValue>(
        () => this.#colorModeSource.value() ?? DEFAULT_INITIAL_COLOR_MODE
    );

    #systemConfigSource = reactive<ChakraSystemConfigSupplier>(() => undefined);
    #systemConfig = computed<ChakraSystemConfig | undefined>(
        () => this.#systemConfigSource.value() ?? undefined
    );

    constructor({ initialChakraSystemConfig, initialColorMode }: ThemeServiceProperties) {
        if (initialColorMode) {
            this.updateColorMode(initialColorMode ?? DEFAULT_INITIAL_COLOR_MODE);
        }
        if (initialChakraSystemConfig) {
            this.updateSystemConfig(initialChakraSystemConfig);
        }
    }

    get colorMode(): ColorModeValue {
        return this.#colorMode.value;
    }

    updateColorMode(value: ColorModeValue | ColorModeValueSupplier): void {
        if (typeof value === "function") {
            this.#colorModeSource.value = value;
        } else {
            this.#colorModeSource.value = () => value;
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
