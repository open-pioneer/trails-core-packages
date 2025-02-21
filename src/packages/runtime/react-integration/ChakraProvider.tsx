// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
    EnvironmentProvider,
    mergeConfigs,
    SystemConfig,
    SystemStyleObject
} from "@chakra-ui/react";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { FC, PropsWithChildren, useMemo, useRef } from "react";
import { config as defaultTrailsConfig } from "@open-pioneer/base-theme";

export type CustomChakraProviderProps = PropsWithChildren<{
    /**
     * Document root node used for styles etc.
     * Note that updates of this property are not supported.
     *
     * This is typically the shadow root.
     */
    rootNode: ShadowRoot | Document;

    /**
     * Chakra system config (can be used to provide custom theme).
     */
    config?: SystemConfig;
}>;

const appRoot = ".pioneer-root";

function redirectHtmlProps(
    css: Record<string, SystemStyleObject> | undefined
): Record<string, SystemStyleObject> {
    const { html, ...rest } = css ?? {};
    if (!html) {
        throw new Error("Internal error: expected global rules on html element.");
    }
    // Take default html styles and apply them to the host element instead
    return {
        ...rest,
        [appRoot]: html
    };
}

function redirectLightCondition(
    conditions: Record<string, unknown> | undefined
): Record<string, unknown> {
    // Make sure light mode tokens are applied
    return {
        ...conditions,
        // Before: ":root &, .light &"
        light: `${appRoot} &, .light &`
    };
}

/**
 * Wraps the entire react application and configures chakra-ui (styling etc.).
 *
 * Exported so it can be used from the test-utils package.
 *
 * @internal
 */ export const CustomChakraProvider: FC<CustomChakraProviderProps> = ({
    rootNode,
    children,
    config = defaultTrailsConfig
}) => {
    /*
        Setup chakra integration:

        1. Mount styles into the shadow root via emotion
        2. Use chakra's EnvironmentProvider to tell it about the shadow root context
        3. Setup global styles correctly (selectors etc.) via chakra's system object
        4. Render the rest of the application
    */

    const system = useMemo(() => {
        const mergedConfig = mergeConfigs(defaultConfig, config);
        return createSystem(
            mergedConfig,
            defineConfig({
                preflight: {
                    scope: appRoot
                },
                cssVarsRoot: appRoot,
                conditions: redirectLightCondition(mergedConfig.conditions),
                globalCss: redirectHtmlProps(mergedConfig.globalCss)
            })
        );
    }, [config]);

    const cache = useEmotionCache(rootNode);
    return (
        <CacheProvider value={cache}>
            <EnvironmentProvider value={rootNode}>
                <ChakraProvider value={system}>{children}</ChakraProvider>
            </EnvironmentProvider>
        </CacheProvider>
    );
};

function useEmotionCache(container: Node): EmotionCache {
    const cacheRef = useRef<EmotionCache>();
    if (!cacheRef.current) {
        cacheRef.current = createCache({
            key: "css",
            container: container
        });
    }
    return cacheRef.current;
}
