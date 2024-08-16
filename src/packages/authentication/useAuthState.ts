// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthService, AuthState } from "./api";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";

/**
 * React hook that always returns the `authService`'s current auth state.
 */
export function useAuthState(authService: AuthService): AuthState {
    const state = useReactiveSnapshot(
        () => authService.getAuthState(),
        [authService]
    );
    return state; 
}
