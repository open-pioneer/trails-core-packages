# @open-pioneer/authentication

## 4.5.0

### Minor Changes

- 4e76893: Update Chakra UI to 3.34.0

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

## 4.0.0

### Major Changes

- 9f074d8: Update to Chakra 3.x

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

## 0.3.6

### Patch Changes

- 5c62522: Update wording and harmonize structure
- e0b2fae: Update dependencies

## 0.3.5

## 0.3.4

## 0.3.3

### Patch Changes

- 64645aa: Update to react 18.3
- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.

## 0.3.2

### Patch Changes

- 5ff8f30: Update package.json metadata.

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
