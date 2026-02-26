// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { type SystemConfig as ChakraSystemConfig } from "@chakra-ui/react";
import { computed, reactive } from "@conterra/reactivity-core";
import {
    type ChakraSystemConfigSupplier,
    type ColorModeValue,
    type ColorModeValueSupplier,
    type ThemeService
} from "../api";

export const DEFAULT_INITIAL_COLOR_MODE: ColorModeValue = "light";

export interface ThemeServiceProperties {
    initialColorMode?: ColorModeValue;
    initialSystemConfig?: ChakraSystemConfig;
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

    constructor({ initialSystemConfig, initialColorMode }: ThemeServiceProperties) {
        if (initialColorMode) {
            this.setColorMode(initialColorMode ?? DEFAULT_INITIAL_COLOR_MODE);
        }
        if (initialSystemConfig) {
            this.setSystemConfig(initialSystemConfig);
        }
    }

    get colorMode(): ColorModeValue {
        return this.#colorMode.value;
    }

    setColorMode(value: ColorModeValue | ColorModeValueSupplier): void {
        if (typeof value === "function") {
            this.#colorModeSource.value = value;
        } else {
            this.#colorModeSource.value = () => value;
        }
    }

    get systemConfig(): ChakraSystemConfig | undefined {
        return this.#systemConfig.value;
    }

    setSystemConfig(value: ChakraSystemConfig | ChakraSystemConfigSupplier | undefined): void {
        if (typeof value === "function") {
            this.#systemConfigSource.value = value;
        } else {
            this.#systemConfigSource.value = () => value;
        }
    }
}
