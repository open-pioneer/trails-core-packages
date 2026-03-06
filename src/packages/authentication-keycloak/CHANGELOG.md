# @open-pioneer/authentication-keycloak

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0

### Patch Changes

- f9aaf46: Bump various dependencies
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.
- Updated dependencies [f9aaf46]
- Updated dependencies [b28d6bc]
- Updated dependencies [554d58e]
- Updated dependencies [1cc3415]
- Updated dependencies [d7ec65c]
- Updated dependencies [1872a6d]
- Updated dependencies [84068f2]
- Updated dependencies [d7ec65c]
    - @open-pioneer/authentication@4.4.0
    - @open-pioneer/core@4.4.0
    - @open-pioneer/notifier@4.4.0
    - @open-pioneer/runtime@4.4.0

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

### Patch Changes

- Updated dependencies [6416dd9]
- Updated dependencies [eb54023]
    - @open-pioneer/notifier@4.3.0
    - @open-pioneer/authentication@4.3.0
    - @open-pioneer/core@4.3.0
    - @open-pioneer/runtime@4.3.0

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- 81308c0: Update to eslint 9
- Updated dependencies [81308c0]
- Updated dependencies [0bcda89]
- Updated dependencies [1b95a62]
    - @open-pioneer/runtime@4.2.0
    - @open-pioneer/core@4.2.0
    - @open-pioneer/authentication@4.2.0
    - @open-pioneer/notifier@4.2.0

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
- Updated dependencies [b7a854d]
- Updated dependencies [3881d08]
- Updated dependencies [f67fd7e]
- Updated dependencies [2da02e7]
- Updated dependencies [adf277b]
- Updated dependencies [3c6191a]
    - @open-pioneer/authentication@4.1.0
    - @open-pioneer/core@4.1.0
    - @open-pioneer/notifier@4.1.0
    - @open-pioneer/runtime@4.1.0

## 4.0.0

### Patch Changes

- 434bd04: Bump dependencies.
- Updated dependencies [9f074d8]
- Updated dependencies [434bd04]
- Updated dependencies [53c92ba]
- Updated dependencies [9f074d8]
- Updated dependencies [9f074d8]
    - @open-pioneer/authentication@4.0.0
    - @open-pioneer/notifier@4.0.0
    - @open-pioneer/runtime@4.0.0
    - @open-pioneer/core@4.0.0

## 3.1.0

### Patch Changes

- 1c1ede8: Bump dependencies.
- Updated dependencies [248dab0]
- Updated dependencies [1c1ede8]
    - @open-pioneer/runtime@3.1.0
    - @open-pioneer/authentication@3.1.0
    - @open-pioneer/core@3.1.0
    - @open-pioneer/notifier@3.1.0

## 3.0.0

### Major Changes

- 9477e54: Update dependencies
    - React 19
    - Vite 6
    - FormatJS 3
    - Open Pioneer Build Tools
    - ...

    For more details, see https://github.com/open-pioneer/trails-core-packages/pull/81

### Patch Changes

- Updated dependencies [9477e54]
    - @open-pioneer/authentication@3.0.0
    - @open-pioneer/core@3.0.0
    - @open-pioneer/notifier@3.0.0
    - @open-pioneer/runtime@3.0.0

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
- Updated dependencies [1ce5f11]
- Updated dependencies [1b63ebe]
- Updated dependencies [e3802fb]
- Updated dependencies [e4ba048]
- Updated dependencies [ac39468]
- Updated dependencies [e3802fb]
    - @open-pioneer/authentication@2.4.0
    - @open-pioneer/core@2.4.0
    - @open-pioneer/notifier@2.4.0
    - @open-pioneer/runtime@2.4.0

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

- Updated dependencies [2fbaaa0]
    - @open-pioneer/authentication@2.3.0
    - @open-pioneer/notifier@2.3.0
    - @open-pioneer/runtime@2.3.0
    - @open-pioneer/core@2.3.0

## 2.2.0

### Patch Changes

- 41f0c6f: Use error state to communicate keycloak exceptions
- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.
- Updated dependencies [41f0c6f]
- Updated dependencies [39dad46]
    - @open-pioneer/authentication@2.2.0
    - @open-pioneer/core@2.2.0
    - @open-pioneer/notifier@2.2.0
    - @open-pioneer/runtime@2.2.0

## 0.2.0

### Minor Changes

- f48bb02: Update Keycloak JavaScript adapter to v25.

### Patch Changes

- 5c62522: Update wording and harmonize structure
- e0b2fae: Update dependencies
- f48bb02: Refactor: use reactivity API internally to maintain the current state.
- Updated dependencies [5c62522]
- Updated dependencies [58ce24f]
- Updated dependencies [50550d3]
- Updated dependencies [e0b2fae]
- Updated dependencies [6cc7fcd]
    - @open-pioneer/authentication@0.3.6
    - @open-pioneer/notifier@0.3.6
    - @open-pioneer/core@1.3.0
    - @open-pioneer/runtime@2.1.7

## 0.1.2

### Patch Changes

- Updated dependencies [e945264]
    - @open-pioneer/runtime@2.1.6
    - @open-pioneer/notifier@0.3.5
    - @open-pioneer/authentication@0.3.5

## 0.1.1

### Patch Changes

- Updated dependencies [90d0cce]
- Updated dependencies [90d0cce]
    - @open-pioneer/runtime@2.1.5
    - @open-pioneer/authentication@0.3.4
    - @open-pioneer/notifier@0.3.4

## 0.1.0

### Minor Changes

- 1b69137: Initial release

### Patch Changes

- Updated dependencies [5d3aafd]
- Updated dependencies [64645aa]
- Updated dependencies [b3c60f2]
    - @open-pioneer/core@1.2.3
    - @open-pioneer/authentication@0.3.3
    - @open-pioneer/notifier@0.3.3
    - @open-pioneer/runtime@2.1.4
