# @open-pioneer/authentication-keycloak

## 2.4.0

### Minor Changes

-   1ce5f11: Replace change events for auth state with signals from Reactivity API

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

-   1b63ebe: Update dependencies
-   Updated dependencies [1ce5f11]
-   Updated dependencies [1b63ebe]
-   Updated dependencies [e3802fb]
-   Updated dependencies [e4ba048]
-   Updated dependencies [ac39468]
-   Updated dependencies [e3802fb]
    -   @open-pioneer/authentication@2.4.0
    -   @open-pioneer/core@2.4.0
    -   @open-pioneer/notifier@2.4.0
    -   @open-pioneer/runtime@2.4.0

## 2.3.0

### Minor Changes

-   2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

-   Updated dependencies [2fbaaa0]
    -   @open-pioneer/authentication@2.3.0
    -   @open-pioneer/notifier@2.3.0
    -   @open-pioneer/runtime@2.3.0
    -   @open-pioneer/core@2.3.0

## 2.2.0

### Patch Changes

-   41f0c6f: Use error state to communicate keycloak exceptions
-   39dad46: Switch to a new versioning strategy.
    From now on, packages released by this repository share a common version number.
-   Updated dependencies [41f0c6f]
-   Updated dependencies [39dad46]
    -   @open-pioneer/authentication@2.2.0
    -   @open-pioneer/core@2.2.0
    -   @open-pioneer/notifier@2.2.0
    -   @open-pioneer/runtime@2.2.0

## 0.2.0

### Minor Changes

-   f48bb02: Update Keycloak JavaScript adapter to v25.

### Patch Changes

-   5c62522: Update wording and harmonize structure
-   e0b2fae: Update dependencies
-   f48bb02: Refactor: use reactivity API internally to maintain the current state.
-   Updated dependencies [5c62522]
-   Updated dependencies [58ce24f]
-   Updated dependencies [50550d3]
-   Updated dependencies [e0b2fae]
-   Updated dependencies [6cc7fcd]
    -   @open-pioneer/authentication@0.3.6
    -   @open-pioneer/notifier@0.3.6
    -   @open-pioneer/core@1.3.0
    -   @open-pioneer/runtime@2.1.7

## 0.1.2

### Patch Changes

-   Updated dependencies [e945264]
    -   @open-pioneer/runtime@2.1.6
    -   @open-pioneer/notifier@0.3.5
    -   @open-pioneer/authentication@0.3.5

## 0.1.1

### Patch Changes

-   Updated dependencies [90d0cce]
-   Updated dependencies [90d0cce]
    -   @open-pioneer/runtime@2.1.5
    -   @open-pioneer/authentication@0.3.4
    -   @open-pioneer/notifier@0.3.4

## 0.1.0

### Minor Changes

-   1b69137: Initial release

### Patch Changes

-   Updated dependencies [5d3aafd]
-   Updated dependencies [64645aa]
-   Updated dependencies [b3c60f2]
    -   @open-pioneer/core@1.2.3
    -   @open-pioneer/authentication@0.3.3
    -   @open-pioneer/notifier@0.3.3
    -   @open-pioneer/runtime@2.1.4
