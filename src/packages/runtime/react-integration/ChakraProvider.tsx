// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
    EnvironmentProvider,
    LocaleProvider,
    mergeConfigs,
    SystemConfig,
    SystemStyleObject
} from "@chakra-ui/react";
import { ReadonlyReactive } from "@conterra/reactivity-core";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider, Global } from "@emotion/react";
import { config as defaultTrailsConfig } from "@open-pioneer/base-theme";
import { Error } from "@open-pioneer/core";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { APP_ROOT_CLASS, getBuiltinStyles, getStylesRoot, RootNode } from "../dom";
import { ErrorId } from "../errors";

/** @internal */
export type CustomChakraProviderProps = PropsWithChildren<{
    /**
     * Document root node.
     */
    rootNode: RootNode;

    /**
     * Web component root.
     *
     * NOTE: undefined for test support only.
     */
    hostNode?: HTMLElement;

    /**
     * Application container (react's render target).
     */
    appRoot: HTMLElement;

    /**
     * Chakra system config (can be used to provide custom theme).
     */
    config?: SystemConfig;

    /**
     * Application locale for chakra's `LocaleProvider`.
     */
    locale?: string;

    /**
     * Custom CSS used by the application.
     */
    styles?: ReadonlyReactive<string>;
}>;

const APP_ROOT_CSS = `.${APP_ROOT_CLASS}`;

/**
 * Wraps the entire react application and configures chakra-ui (styling etc.).
 *
 * Exported so it can be used from the test-utils package.
 *
 * @internal
 */
export const CustomChakraProvider: FC<CustomChakraProviderProps> = ({
    rootNode,
    appRoot,
    hostNode,
    children,
    config = defaultTrailsConfig,
    locale = "en-US",
    styles
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

            // https://www.chakra-ui.com/docs/get-started/environments/shadow-dom
            defineConfig({
                preflight: {
                    scope: APP_ROOT_CSS
                },
                cssVarsRoot: APP_ROOT_CSS,
                conditions: redirectLightCondition(mergedConfig.conditions),
                globalCss: redirectHtmlProps(mergedConfig.globalCss)
            })
        );
    }, [config]);

    useEffect(() => {
        const classes = appRoot.classList;
        const colorMode = "light"; // "light" | "dark"
        classes.add(colorMode);
        return () => {
            classes.remove(colorMode);
        };
    }, [appRoot]);

    const cache = useEmotionCache(rootNode);
    return (
        cache && (
            <CacheProvider value={cache}>
                <EnvironmentProvider
                    value={rootNode}
                    // Patched property
                    portalNode={appRoot}
                >
                    <LocaleProvider locale={locale}>
                        <ChakraProvider value={system}>
                            <GlobalStyles rootNode={rootNode} hostNode={hostNode} styles={styles} />
                            {children}
                        </ChakraProvider>
                    </LocaleProvider>
                </EnvironmentProvider>
            </CacheProvider>
        )
    );
};

function GlobalStyles(props: {
    rootNode: RootNode;
    hostNode: HTMLElement | undefined;
    styles: ReadonlyReactive<string> | undefined;
}) {
    const { rootNode, hostNode, styles } = props;
    const builtinStyles = useMemo(() => {
        const css = getBuiltinStyles(rootNode, hostNode);
        return <Global styles={css} />;
    }, [rootNode, hostNode]);
    const appStyles = useReactiveSnapshot(() => {
        const css = styles?.value;
        return css && <Global styles={css} />;
    }, [styles]);
    return (
        <>
            {builtinStyles}
            {appStyles}
        </>
    );
}

function redirectHtmlProps(
    css: Record<string, SystemStyleObject> | undefined
): Record<string, SystemStyleObject> {
    const { html, ...rest } = css ?? {};
    if (!html) {
        throw new Error(ErrorId.INTERNAL, "Expected global rules on html element.");
    }
    // Take default html styles and apply them to the host element instead
    return {
        ...rest,
        [APP_ROOT_CSS]: html
    };
}

function redirectLightCondition(
    conditions: Record<string, unknown> | undefined
): Record<string, unknown> {
    // Make sure light mode tokens are applied
    return {
        ...conditions,
        // Before: ":root &, .light &"
        light: `${APP_ROOT_CSS} &, .light &`
    };
}

function useEmotionCache(rootNode: RootNode): EmotionCache | undefined {
    const stylesRoot = useMemo(() => getStylesRoot(rootNode), [rootNode]);

    const [cache, setCache] = useState<EmotionCache | undefined>();
    useEffect(() => {
        const cache = createCache({
            key: "css",
            container: stylesRoot
        });
        setCache(cache);
        return () => {
            setCache(undefined);
            for (const tag of cache.sheet.tags) {
                tag.remove();
            }
        };
    }, [stylesRoot]);
    return cache;
}
