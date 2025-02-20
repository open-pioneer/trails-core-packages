// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    CSSReset,
    DarkMode,
    EnvironmentProvider,
    GlobalStyle,
    LightMode,
    ThemeProvider,
    ToastOptionProvider,
    ToastProvider,
    ToastProviderProps,
    extendTheme,
    theme as chakraBaseTheme
} from "@chakra-ui/react";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider, Global } from "@emotion/react";
import { FC, PropsWithChildren, RefObject, useEffect, useMemo, useRef } from "react";
import { PortalRootProvider } from "./PortalFix";

export type CustomChakraProviderProps = PropsWithChildren<{
    /**
     * Container node where styles will be mounted.
     * Note that updates of this property are not supported.
     *
     * This is typically the shadow root.
     */
    container: Node;

    /**
     * Configures the color mode of the application.
     */
    colorMode?: "light" | "dark";

    /**
     * Chakra theming object.
     */
    theme?: Record<string, unknown>;
}>;

// todo min-height vs height
const defaultStyles = `
.chakra-host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    font-family: system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    touch-action: manipulation;
    position: relative;
    min-height: 100%;
    height: 100%;
    font-feature-settings: 'kern';
}`;

// https://github.dev/chakra-ui/chakra-ui/blob/80971001d7b77d02d5f037487a37237ded315480/packages/components/color-mode/src/color-mode.utils.ts#L3-L6
const colorModeClassnames = {
    light: "chakra-ui-light",
    dark: "chakra-ui-dark"
};

// https://github.com/chakra-ui/chakra-ui/issues/2439
export const CustomChakraProvider: FC<CustomChakraProviderProps> = ({
    container,
    colorMode,
    children,
    theme: themeProp
}) => {
    /* 
        Chakra integration internals:

        1. Setting the emotion cache to render into 'container' instead of the document by default.
           This encapsulates the styles in the shadow root and ensures that components in the shadow dom
           are rendered correctly.

        2. Handling the color mode on our own. Chakra's default behavior will inject class names & data
           globally into the document's html / body nodes.

           NOTE: Color mode is not initialized from the system automatically right now, this can be added in the future.

        3. Changing the location for toasts to render inside the shadow root instead of the host document (via ToastProvider etc).

        4. Changing the default container for <Portal /> and components using <Portal /> (e.g. Modal, Drawer) to render inside the shadow dom.
           This happens in the PortalFix.ts module (all components receive the chakraHost div via PortalRootProvider).

        NOTE:
            For reference:
                https://github.dev/chakra-ui/chakra-ui/blob/80971001d7b77d02d5f037487a37237ded315480/packages/components/provider/src/chakra-provider.tsx#L89-L102
            and
                https://github.dev/chakra-ui/chakra-ui/blob/80971001d7b77d02d5f037487a37237ded315480/packages/components/react/src/chakra-provider.tsx#L31-L33

            Essentially, we do pretty much the same thing as the ChakraProvider, but manually.

        The integration is rather complex already, but did not justify forking the chakra-ui project as of yet.
        Should it grow even more bothersome, chakra should be forked and the steps above should then be made to the chakra's source code,
        which would be somewhat easier:

            1. Accept a top level `rootContainer` element (optional) and provide it down the component tree.
            2. Use `rootContainer` (if present) as the fallback location for <Portal />, if no containerRef has been set (automatically fixes Modal, Drawer, and possibly Toasts).
            3. Pass `rootContainer` to the emotion cache for css mounting.
            4. Set color mode on the root container instead of html and body.
        
    */

    const cache = useEmotionCache(container);

    const theme = useMemo(() => wrapTheme(themeProp), [themeProp]);

    const chakraHost = useRef<HTMLDivElement>(null);
    const toastOptions: ToastProviderProps = {
        portalProps: {
            containerRef: chakraHost
        }
    };

    const ColorMode = useSyncedColorMode(chakraHost, colorMode);

    return (
        <div className="chakra-host" ref={chakraHost}>
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <EnvironmentProvider>
                        <ColorMode>
                            <CSSReset />
                            <Global styles={defaultStyles} />
                            <GlobalStyle />
                            <ToastOptionProvider value={toastOptions?.defaultOptions}>
                                <PortalRootProvider value={chakraHost}>
                                    {children}
                                </PortalRootProvider>
                            </ToastOptionProvider>
                            <ToastProvider {...toastOptions} />
                        </ColorMode>
                    </EnvironmentProvider>
                </ThemeProvider>
            </CacheProvider>
        </div>
    );
};

/**
 * Computes the correct color mode and returns a component that will apply that mode.
 *
 * The current color mode is automatically propagates as a css class on the chakra host element.
 */
function useSyncedColorMode(
    chakraHost: RefObject<HTMLDivElement>,
    colorMode: "light" | "dark" | undefined
) {
    const mode = colorMode ?? "light";
    useEffect(() => {
        const host = chakraHost.current;
        if (!host) {
            return;
        }

        // https://github.dev/chakra-ui/chakra-ui/blob/80971001d7b77d02d5f037487a37237ded315480/packages/components/color-mode/src/color-mode.utils.ts#L16-L25
        const className = colorModeClassnames[mode];
        host.classList.add(className);
        host.dataset.theme = mode;
        return () => {
            host.classList.remove(className);
            host.dataset.theme = undefined;
        };
    }, [chakraHost, mode]);
    const ColorMode = mode === "light" ? LightMode : DarkMode;
    return ColorMode;
}

function wrapTheme(theme: Record<string, unknown> = chakraBaseTheme): Record<string, unknown> {
    return extendTheme(
        {
            styles: {
                //add global css styles here
                global: {
                    // Apply the same styles to the application root node that chakra would usually apply to the html and body.
                    ".chakra-host":
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (chakraBaseTheme.styles.global as Record<string, any>).body
                }
            }
        },
        theme
    );
}

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
