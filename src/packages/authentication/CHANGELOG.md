# @open-pioneer/authentication

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

### Patch Changes

- Updated dependencies [eb54023]
    - @open-pioneer/core@4.3.0
    - @open-pioneer/reactivity@4.3.0
    - @open-pioneer/runtime@4.3.0

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- Updated dependencies [81308c0]
- Updated dependencies [ed3d452]
- Updated dependencies [0bcda89]
- Updated dependencies [1b95a62]
    - @open-pioneer/reactivity@4.2.0
    - @open-pioneer/runtime@4.2.0
    - @open-pioneer/core@4.2.0

## 4.1.0

### Minor Changes

- f67fd7e: New `options` parameter for the `logout` method of `AuthService`.

    This will allow you to pass custom options that may be supported by the active authentication plugin.

    ```ts
    const authService = ...; // injected
    authService.logout({
        // Interpretation of this parameter highly depends on the active authentication plugin.
        pluginOptions: {
            redirectUri: "https://example.com"
        }
    })
    ```

### Patch Changes

- b7a854d: Update dependencies
- adf277b: Update dependencies
- Updated dependencies [b7a854d]
- Updated dependencies [3881d08]
- Updated dependencies [2da02e7]
- Updated dependencies [adf277b]
    - @open-pioneer/core@4.1.0
    - @open-pioneer/reactivity@4.1.0
    - @open-pioneer/runtime@4.1.0

## 4.0.0

### Major Changes

- 9f074d8: Update to Chakra 3.x

### Patch Changes

- 434bd04: Bump dependencies.
- Updated dependencies [9f074d8]
- Updated dependencies [434bd04]
- Updated dependencies [53c92ba]
- Updated dependencies [9f074d8]
- Updated dependencies [1f4fa84]
    - @open-pioneer/runtime@4.0.0
    - @open-pioneer/core@4.0.0
    - @open-pioneer/reactivity@4.0.0

## 3.1.0

### Patch Changes

- 1c1ede8: Bump dependencies.
- Updated dependencies [248dab0]
- Updated dependencies [1c1ede8]
    - @open-pioneer/runtime@3.1.0
    - @open-pioneer/chakra-integration@3.1.0
    - @open-pioneer/core@3.1.0
    - @open-pioneer/reactivity@3.1.0

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
    - @open-pioneer/chakra-integration@3.0.0
    - @open-pioneer/core@3.0.0
    - @open-pioneer/reactivity@3.0.0
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
- Updated dependencies [1b63ebe]
- Updated dependencies [e3802fb]
- Updated dependencies [ac39468]
- Updated dependencies [e3802fb]
    - @open-pioneer/chakra-integration@2.4.0
    - @open-pioneer/core@2.4.0
    - @open-pioneer/reactivity@2.4.0
    - @open-pioneer/runtime@2.4.0

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

- Updated dependencies [2fbaaa0]
    - @open-pioneer/chakra-integration@2.3.0
    - @open-pioneer/runtime@2.3.0
    - @open-pioneer/core@2.3.0

## 2.2.0

### Minor Changes

- 41f0c6f: Introduce new authentication state `AuthStateAuthenticationError`

    Error state is supposed to be used for errors that occur during the authentication process (e.g. lost connection to authentication backend) rather than for failed login attempts (e.g. invalid credentials)

    `ForceAuth` component provides two mechanisms to render a fallback component if an authentication error occurs.

    `errorFallback` option takes an abitrary react component that is rendered in case of an error. The error object can be accessed via the ErrorFallbackPros.

    ```jsx
    <ForceAuth errorFallback={ErrorFallback}>
       App Content
     </ForceAuth>

     function ErrorFallback(props: ErrorFallbackProps) {
       return (
         <>
           <Box margin={2} color={"red"}>{props.error.message}</Box>
        </>
       );
     }
    ```

    If additional inputs or state must be accessed from within the error fallback component the `renderErrorFallback` option should be used.

    ```jsx
    const userName = "user1";
    <ForceAuth  renderErrorFallback={(e: Error) => (
          <>
              <Box>Could not login {userName}</Box>
              <Box color={"red"}>{e.message}</Box>
           </>
      )}>
      App Content
    </ForceAuth>
    ```

    The `renderErrorFallback` property takes precedence over the `errorFallback` property.

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.
- Updated dependencies [39dad46]
    - @open-pioneer/chakra-integration@2.2.0
    - @open-pioneer/core@2.2.0
    - @open-pioneer/runtime@2.2.0

## 0.3.6

### Patch Changes

- 5c62522: Update wording and harmonize structure
- e0b2fae: Update dependencies
- Updated dependencies [5c62522]
- Updated dependencies [58ce24f]
- Updated dependencies [50550d3]
- Updated dependencies [e0b2fae]
- Updated dependencies [6cc7fcd]
    - @open-pioneer/core@1.3.0
    - @open-pioneer/runtime@2.1.7

## 0.3.5

### Patch Changes

- Updated dependencies [e945264]
    - @open-pioneer/runtime@2.1.6

## 0.3.4

### Patch Changes

- Updated dependencies [90d0cce]
- Updated dependencies [90d0cce]
    - @open-pioneer/runtime@2.1.5

## 0.3.3

### Patch Changes

- 64645aa: Update to react 18.3
- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.
- Updated dependencies [5d3aafd]
- Updated dependencies [64645aa]
- Updated dependencies [b3c60f2]
    - @open-pioneer/core@1.2.3
    - @open-pioneer/runtime@2.1.4

## 0.3.2

### Patch Changes

- 5ff8f30: Update package.json metadata.
- Updated dependencies [5ff8f30]
    - @open-pioneer/runtime@2.1.3
    - @open-pioneer/core@1.2.2

## 0.3.1

### Patch Changes

- 4eac7c7: Move packages into core-packages repository.
    - @open-pioneer/runtime@2.1.2

## 0.3.0

### Minor Changes

- ee7c2d4: Update runtime version.

## 0.2.0

### Minor Changes

- 70349a8: Update to new core packages major versions

## 0.1.0

### Minor Changes

- 13a0289: Initial release.
