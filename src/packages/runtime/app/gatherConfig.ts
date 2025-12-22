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
 * Gathers application properties by reading them from the options object
 * and by (optionally) invoking the `resolveProperties` hook.
 */
export async function gatherConfig(
    hostElement: HTMLElement,
    options: CustomElementOptions,
    overrides?: ApplicationOverrides
) {
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

        configs = [staticConfig, dynamicConfig];
    } catch (e) {
        throw new Error(
            ErrorId.CONFIG_RESOLUTION_FAILED,
            "Failed to resolve application properties.",
            {
                cause: e
            }
        );
    }

    const merged = mergeConfigs(configs);
    if (overrides?.locale) {
        merged.locale = overrides.locale;
    }
    return merged;
}

/**
 * Merges application configurations into a single object.
 * Properties / config parameters at a later position overwrite properties from earlier ones.
 */
function mergeConfigs(configs: ApplicationConfig[]): Required<ApplicationConfig> {
    // Merge simple values by assigning them in order
    const mergedConfig: Required<ApplicationConfig> = Object.assign(
        {
            locale: undefined,
            properties: {}
        } satisfies ApplicationConfig,
        ...configs
    );

    // Deep merge for application properties
    const mergedProperties: ApplicationProperties = (mergedConfig.properties = {});
    for (const config of configs) {
        for (const [packageName, packageProperties] of Object.entries(config.properties ?? {})) {
            const mergedPackageProps = (mergedProperties[packageName] ??= {});
            Object.assign(mergedPackageProps, packageProperties);
        }
    }

    return mergedConfig;
}
