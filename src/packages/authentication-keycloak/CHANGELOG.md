# @open-pioneer/authentication-keycloak

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0

### Patch Changes

- f9aaf46: Bump various dependencies
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- 81308c0: Update to eslint 9

## 4.1.0

### Minor Changes

- f67fd7e: Support configuration of keycloak's login options and logout options.

    For example, to redirect to a different site after logout:

    ```ts
    // app.ts
    const element = createCustomElement({
        component: AppUI,
        appMetadata,
        config: {
            properties: {
                "@open-pioneer/authentication-keycloak": {
                    keycloakOptions: {
                        // ...
                        keycloakLogoutOptions: {
                            redirectUri: "https://example.com"
                        }
                    }
                } satisfies KeycloakProperties
            }
        }
    });
    ```

    The plugin also supports options for the `logout` method to supply dynamic logout options:

    ```ts
    // via auth service
    const authService = ...;
    authService.logout({
        // These are passed directly the keycloak plugin (if it is being used).
        pluginOptions: {
            redirectUri: "https://example.com",
        }
    })

    // via direct reference to the plugin ("authentication-keycloak.KeycloakAuthPlugin")
    const keycloakAuthPlugin = ...;
    keycloakAuthPlugin.logout({
        redirectUri: "https://example.com",
    });
    ```

- f67fd7e: Make `RefreshOptions` optional with sensible default values. The default values have been changed to:
    - `autoRefresh`: true
    - `interval` (for token lifetime checks): 10 seconds
    - `timeLeft`: 60 seconds (minimum required lifetime during token validity checks)

    These values are used when they are not explicitly configured using package properties.

### Patch Changes

- b7a854d: Update dependencies
- adf277b: Update dependencies

## 4.0.0

### Patch Changes

- 434bd04: Bump dependencies.

## 3.1.0

### Patch Changes

- 1c1ede8: Bump dependencies.

## 3.0.0

### Major Changes

- 9477e54: Update dependencies
    - React 19
    - Vite 6
    - FormatJS 3
    - Open Pioneer Build Tools
    - ...

    For more details, see https://github.com/open-pioneer/trails-core-packages/pull/81

## 2.4.0

### Minor Changes

- 1ce5f11: Replace change events for auth state with signals from Reactivity API

    Example: watch for updates of the auth state

    ```typescript
    const myAuthService = ...
    watch(
        () => [myAuthService.getAuthState()],
        ([state]) => {
            console.log(state);
        },
        {
            immediate: true
        }
    );
    ```

    The Auth Service forwards the auth state from the underlying AuthPlugin.
    Therefore, the plugin implementation must use reactive signals when its auth state changes in order to signal changes to the service.

    ```typescript
    class DummyPlugin implements AuthPlugin {
        #state = reactive<AuthState>({
            kind: "not-authenticated"
        });

        getAuthState(): AuthState {
            return this.#state.value;
        }

        $setAuthState(newState: AuthState) {
            this.#state.value = newState;
        }
    }
    ```

### Patch Changes

- 1b63ebe: Update dependencies

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

## 2.2.0

### Patch Changes

- 41f0c6f: Use error state to communicate keycloak exceptions
- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.

## 0.2.0

### Minor Changes

- f48bb02: Update Keycloak JavaScript adapter to v25.

### Patch Changes

- 5c62522: Update wording and harmonize structure
- e0b2fae: Update dependencies
- f48bb02: Refactor: use reactivity API internally to maintain the current state.

## 0.1.2

## 0.1.1

## 0.1.0

### Minor Changes

- 1b69137: Initial release
