// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useService } from "open-pioneer:react-hooks";
import { ComponentType, FC, ReactNode, useEffect, useMemo } from "react";
import {
    // For typedoc link
    // eslint-disable-next-line unused-imports/no-unused-imports
    AuthPlugin,
    AuthService
} from "./api";
import { useAuthState } from "./useAuthState";
import { Box } from "@chakra-ui/react";
import { useIntl } from "open-pioneer:react-hooks";

/**
 * Properties for the ForceAuth component.
 */
export interface ForceAuthProps {
    /**
     * These properties will be provided to the AuthFallback component implemented by the authentication plugin.
     *
     * NOTE: This property is not used when {@link renderFallback} is specified.
     */
    fallbackProps?: Record<string, unknown>;

    /**
     * This property can be used to customize rendering of the authentication fallback.
     *
     * The `AuthFallback` parameter passed to the render prop is the fallback implemented by the authentication plugin.
     * You can customize the rendering of the fallback by implementing this function.
     * For example, `AuthFallback` could be wrapped with a few parent components.
     *
     * NOTE: `renderFallback` takes precedence before {@link fallbackProps}.
     *
     * Example:
     *
     * ```jsx
     * <ForceAuth
     *     renderFallback={(AuthFallback) => {
     *         return (
     *             <SomeContainer>
     *                 <AuthFallback foo="bar" />
     *             </SomeContainer>
     *         );
     *     }}
     * >
     *     App Content
     * </ForceAuth>
     * ```
     */
    renderFallback?: (AuthFallback: ComponentType<Record<string, unknown>>) => ReactNode;

    /**
     * This component is rendered as fallback if an error occurs during authentication (e.g authentication backend is not available).
     * The actual error that occured is accesible from within the fallback component via {@link ErrorFallbackProps}
     *
     * Example:
     *
     * ```jsx
     * <ForceAuth errorFallback={ErrorFallback}>
     *   App Content
     * </ForceAuth>
     *
     * function ErrorFallback(props: ErrorFallbackProps) {
     *   return (
     *     <>
     *       <Box margin={2} color={"red"}>{props.error.message}</Box>
     *     </>
     *   );
     * }
     * ```
     */
    errorFallback?: ComponentType<ErrorFallbackProps>;

    /**
     * This property can be used to customize rendering of the error fallback.
     * The `renderErrorFallback` should be used if inputs other than {@link ErrorFallbackProps} are to be used in the error fallback.
     *
     * NOTE: `renderErrorFallback` takes precedence before {@link errorFallback}.
     *
     * Example:
     *
     * ```jsx
     * const userName = "user1";
     * <ForceAuth  renderErrorFallback={(e: Error) => (
     *      <>
     *          <Box>Could not login {userName}</Box>
     *          <Box color={"red"}>{e.message}</Box>
     *       </>
     *  )}>
     *   App Content
     * </ForceAuth>
     * ```
     *
     * @param error the error that occured during authentication
     */
    renderErrorFallback?: (error: Error) => ReactNode;

    /** The children are rendered if the current user is authenticated. */
    children?: ReactNode;
}

/**
 * `ErrorFallbackProps` properties indicate the error that happened in the authentication process.
 */
export interface ErrorFallbackProps {
    error: Error;
}

/**
 * `ForceAuth` renders its children if the current user is authenticated.
 * If the user is not authenticated, a `AuthFallback` will be presented to the user.
 *
 * The implementation of the `AuthFallback` depends on the authentication plugin used by the application
 * (see {@link AuthPlugin}).
 *
 * For an application that requires the user to always be logged in, simply
 * surround the entire application UI with the `ForceAuth` component:
 *
 * ```jsx
 * import { ForceAuth } from "@open-pioneer/authentication";
 *
 * export function AppUI() {
 *     return (
 *         <ForceAuth>
 *              <TheRestOfYourApplication />
 *         </ForceAuth>
 *     );
 * }
 * ```
 */
export const ForceAuth: FC<ForceAuthProps> = (props) => {
    const authService = useService<AuthService>("authentication.AuthService");
    const state = useAuthState(authService);
    const intl = useIntl();

    // Extract login behavior from service (only when needed).
    const behavior = useMemo(() => {
        if (state.kind === "not-authenticated") {
            return authService.getLoginBehavior();
        }
    }, [authService, state.kind]);

    // Call the login effect (if any) if not authenticated.
    useEffect(() => {
        if (state.kind === "not-authenticated" && behavior?.kind === "effect") {
            behavior.login();
        }
    }, [behavior, state.kind]);

    switch (state.kind) {
        case "pending":
            return null;
        case "not-authenticated": {
            if (!behavior || behavior.kind !== "fallback") {
                return null;
            }

            const AuthFallback = behavior.Fallback;
            if (props.renderFallback) {
                return <>{props.renderFallback(AuthFallback)}</>;
            }
            return <AuthFallback {...props.fallbackProps} />;
        }
        case "error":
            if (props.renderErrorFallback) {
                return props.renderErrorFallback(state.error);
            } else if (props.errorFallback) {
                return <props.errorFallback error={state.error} />;
            } else {
                return (
                    <Box className="authentication-error">
                        {intl.formatMessage({ id: "auth-error" })}
                    </Box>
                );
            }
        case "authenticated":
            return <>{props.children}</>;
    }
};
