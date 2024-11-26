// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
    EnvironmentProvider,
    SystemStyleObject
} from "@chakra-ui/react";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { FC, PropsWithChildren, useRef } from "react";

export type CustomChakraProviderProps = PropsWithChildren<{
    /**
     * Container node where styles will be mounted.
     * Note that updates of this property are not supported.
     *
     * This is typically the shadow root.
     */
    container: Node;

    /**
     * Chakra theming object.
     */
    theme?: Record<string, unknown>;
}>;

const appRoot = ".pioneer-root";
const system = createSystem(
    defaultConfig,
    defineConfig({
        preflight: {
            scope: appRoot
        },
        cssVarsRoot: appRoot,
        conditions: redirectLightCondition(defaultConfig.conditions),
        globalCss: redirectHtmlProps(defaultConfig.globalCss)
    })
);

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

export const CustomChakraProvider: FC<CustomChakraProviderProps> = ({ container, children }) => {
    /*
        Setup chakra integration:

        1. Mount styles into the shadow root via emotion
        2. Use chakra's EnvironmentProvider to tell it about the shadow root context
        3. Setup global styles correctly (selectors etc.) via chakra's system object
        4. Render the rest of the application

        TODO: Force a specific portal container?
    */
    const cache = useEmotionCache(container);
    return (
        <CacheProvider value={cache}>
            <EnvironmentProvider value={container}>
                <ChakraProvider value={system}>{children}</ChakraProvider>
            </EnvironmentProvider>
        </CacheProvider>
    );
};

// function wrapTheme(theme: Record<string, unknown> = chakraBaseTheme): Record<string, unknown> {
//     return extendTheme(
//         {
//             styles: {
//                 //add global css styles here
//                 global: {
//                     // Apply the same styles to the application root node that chakra would usually apply to the html and body.
//                     ".chakra-host":
//                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                         (chakraBaseTheme.styles.global as Record<string, any>).body
//                 }
//             }
//         },
//         theme
//     );
// }

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
