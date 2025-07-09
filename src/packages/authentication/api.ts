// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import type { DeclaredService } from "@open-pioneer/runtime";
import type { ComponentType } from "react";

/**
 * Information about the authenticated user's session.
 */
export interface SessionInfo {
    /** Technical user id of the authenticated user, for example an email address. */
    userId: string;

    /**
     * Display name of the authenticated user.
     * Use the {@link userId} as a default value if this value is not available.
     */
    userName?: string | undefined;

    /** Set to a date if the session expires at some point. Optional. */
    expiresAt?: Date | undefined;

    /** Arbitrary attributes from the authentication plugin. */
    attributes?: Record<string, unknown> | undefined;
}

/**
 * Models the current authentication state.
 *
 * NOTE: Future versions of this package may define additional states.
 * Your code should contain sensible fallback or error logic.
 */
export type AuthState =
    | AuthStatePending
    | AuthStateNotAuthenticated
    | AuthStateAuthenticated
    | AuthStateAuthenticationError;

/**
 * This state is active when the authentication service
 * is still checking whether the current user is authenticated or not.
 */
export interface AuthStatePending {
    kind: "pending";
}

/**
 * The user not authenticated.
 */
export interface AuthStateNotAuthenticated {
    kind: "not-authenticated";
}

/**
 * This state indicates an error during authentication.
 * This state should used for errors in the authentication workflow (e.g. backend unavailable) rather than failed login attempts (e.g. invalid credentials).
 */
export interface AuthStateAuthenticationError {
    kind: "error";
    error: Error;
}

/**
 * The user is authenticated and its session attributes
 * can be retrieved.
 */
export interface AuthStateAuthenticated {
    kind: "authenticated";
    sessionInfo: SessionInfo;
}

/**
 * Defines the behavior of the authentication service when attempting to
 * authenticate a user.
 */
export type LoginBehavior = LoginFallback | LoginEffect;

/**
 * A fallback react component to present to the user.
 * For example, this can be a login form or a message.
 */
export interface LoginFallback {
    kind: "fallback";
    Fallback: ComponentType;
}

/**
 * An effect to perform when the user shall be authenticated.
 * `login()` may, for example, perform a redirect to an authentication provider.
 */
export interface LoginEffect {
    kind: "effect";
    login(): void;
}

/**
 * Options that can be passed to the {@link AuthService.logout} method.
 */
export interface LogoutOptions {
    /**
     * Custom options that will be passed directly to the currently active {@link AuthPlugin}.
     */
    pluginOptions?: unknown;
}

/**
 * Manages the current user's authentication state.
 *
 * The current state (such as session info) can be retrieved and watched for changes.
 */
export interface AuthService extends DeclaredService<"authentication.AuthService"> {
    /**
     * Returns the current authentication state.
     *
     * The state may initially be `pending` to allow for async initialization in the authentication plugin.
     * After initialization, the state is either `not-authenticated` or `authenticated`.
     *
     * Use Reactivity API to watch the auth state.
     */
    getAuthState(): AuthState;

    /**
     * Returns the current user's {@link SessionInfo} or `undefined`, if the current user is not authenticated.
     *
     * The method is asynchronous to allow for async initialization in the authentication plugin.
     */
    getSessionInfo(): Promise<SessionInfo | undefined>;

    /**
     * Returns the login behavior that should be performed if the user is not authenticated.
     *
     * The actual implementation of this component depends on the application's authentication plugin.
     */
    getLoginBehavior(): LoginBehavior;

    /**
     * Terminates the current session (if any).
     */
    logout(options?: LogoutOptions): void;
}

/**
 * The authentication service requires an AuthPlugin to implement a concrete authentication flow.
 *
 * The plugin provides the current authentication state and the authentication fallback to the service.
 *
 * The current authentication state returned by {@link getAuthState} may change.
 * If that is the case, the plugin must implement its auth state with Reactivity API.
 */
export interface AuthPlugin extends DeclaredService<"authentication.AuthPlugin"> {
    /**
     * Returns the current authentication state.
     *
     * Objects returned by this method should not be mutated.
     * Emit the `changed` event instead to communicate that there is a new state.
     */
    getAuthState(): AuthState;

    /**
     * Returns the login behavior that should be performed if the user is not authenticated.
     */
    getLoginBehavior(): LoginBehavior;

    /**
     * Explicitly triggers a logout.
     *
     * Should result in a new state (including a `changed` event) if the user
     * was authenticated.
     *
     * @param options Custom options that may be supported by the plugin.
     * The optional `pluginOptions` in {@link AuthService.logout} will be passed to this parameter.
     * This parameter is not typed at this point (but should be in the plugin's actual implementation).
     */
    logout(options?: unknown): Promise<void> | void;
}
