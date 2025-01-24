# @open-pioneer/authentication

## 2.3.0

### Minor Changes

-   2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

-   Updated dependencies [2fbaaa0]
    -   @open-pioneer/chakra-integration@2.3.0
    -   @open-pioneer/runtime@2.3.0
    -   @open-pioneer/core@2.3.0

## 2.2.0

### Minor Changes

-   41f0c6f: Introduce new authentication state `AuthStateAuthenticationError`

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

-   39dad46: Switch to a new versioning strategy.
    From now on, packages released by this repository share a common version number.
-   Updated dependencies [39dad46]
    -   @open-pioneer/chakra-integration@2.2.0
    -   @open-pioneer/core@2.2.0
    -   @open-pioneer/runtime@2.2.0

## 0.3.6

### Patch Changes

-   5c62522: Update wording and harmonize structure
-   e0b2fae: Update dependencies
-   Updated dependencies [5c62522]
-   Updated dependencies [58ce24f]
-   Updated dependencies [50550d3]
-   Updated dependencies [e0b2fae]
-   Updated dependencies [6cc7fcd]
    -   @open-pioneer/core@1.3.0
    -   @open-pioneer/runtime@2.1.7

## 0.3.5

### Patch Changes

-   Updated dependencies [e945264]
    -   @open-pioneer/runtime@2.1.6

## 0.3.4

### Patch Changes

-   Updated dependencies [90d0cce]
-   Updated dependencies [90d0cce]
    -   @open-pioneer/runtime@2.1.5

## 0.3.3

### Patch Changes

-   64645aa: Update to react 18.3
-   b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.
-   Updated dependencies [5d3aafd]
-   Updated dependencies [64645aa]
-   Updated dependencies [b3c60f2]
    -   @open-pioneer/core@1.2.3
    -   @open-pioneer/runtime@2.1.4

## 0.3.2

### Patch Changes

-   5ff8f30: Update package.json metadata.
-   Updated dependencies [5ff8f30]
    -   @open-pioneer/runtime@2.1.3
    -   @open-pioneer/core@1.2.2

## 0.3.1

### Patch Changes

-   4eac7c7: Move packages into core-packages repository.
    -   @open-pioneer/runtime@2.1.2

## 0.3.0

### Minor Changes

-   ee7c2d4: Update runtime version.

## 0.2.0

### Minor Changes

-   70349a8: Update to new core packages major versions

## 0.1.0

### Minor Changes

-   13a0289: Initial release.
