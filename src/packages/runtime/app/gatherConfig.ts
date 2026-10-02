// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Error } from "@open-pioneer/core";
import {
    ApplicationConfig,
    ApplicationOverrides,
    ApplicationProperties,
    CustomElementOptions
} from "../CustomElement";
import { ErrorId } from "../errors";

/**
 * Gathers the application config by reading it from the options object
 * and by (optionally) invoking the `resolveConfig` hook.
 */
export async function gatherConfig(
    hostElement: HTMLElement,
    options: CustomElementOptions,
    overrides?: ApplicationOverrides
): Promise<ResolvedApplicationConfig> {
    let configs: ApplicationConfig[];
    try {
        const staticConfig = options.config ?? {};
        const dynamicConfig =
            (await options.resolveConfig?.({
                hostElement,
                getAttribute(name) {
                    return hostElement.getAttribute(name) ?? undefined;
                },
                overrides
            })) ?? {};

        configs = [
            {
                chakraSystemConfig: options.chakraSystemConfig
            },
            staticConfig,
            dynamicConfig
        ];
    } catch (e) {
        throw new Error(
            ErrorId.CONFIG_RESOLUTION_FAILED,
            "Failed to resolve the application config.",
            {
                cause: e
            }
        );
    }

    const merged = mergeConfigs(configs);
    if (overrides) {
        if (overrides.locale) {
            merged.locale = overrides.locale;
        }
        if (overrides.colorMode) {
            merged.colorMode = overrides.colorMode;
        }
        if (overrides.chakraSystemConfig) {
            merged.chakraSystemConfig = overrides.chakraSystemConfig;
        }
    }

    return merged;
}

/**
 * The application config after merging all sources.
 * Every key is present, but values might be `undefined`.
 */
export type ResolvedApplicationConfig = {
    [K in keyof Required<ApplicationConfig>]: ApplicationConfig[K] | undefined;
} & {
    properties: ApplicationProperties;
};

/**
 * Merges application configurations into a single object.
 *
 * Properties / config parameters at a later position overwrite properties from earlier ones. *
 * A key whose value is `undefined` does not override a previous value.
 */
function mergeConfigs(configs: ApplicationConfig[]): ResolvedApplicationConfig {
    const mergedConfig: ResolvedApplicationConfig = {
        locale: undefined,
        supportedLocales: undefined,
        chakraSystemConfig: undefined,
        colorMode: undefined,
        properties: {}
    };
    for (const config of configs) {
        if (config.locale !== undefined) {
            mergedConfig.locale = config.locale;
        }
        if (config.supportedLocales !== undefined) {
            mergedConfig.supportedLocales = config.supportedLocales;
        }
        if (config.chakraSystemConfig !== undefined) {
            mergedConfig.chakraSystemConfig = config.chakraSystemConfig;
        }
        if (config.colorMode !== undefined) {
            mergedConfig.colorMode = config.colorMode;
        }
    }

    // Deep merge for application properties
    const mergedProperties = mergedConfig.properties;
    for (const config of configs) {
        for (const [packageName, packageProperties] of Object.entries(config.properties ?? {})) {
            const mergedPackageProps = (mergedProperties[packageName] ??= {});
            Object.assign(mergedPackageProps, packageProperties);
        }
    }

    return mergedConfig;
}
