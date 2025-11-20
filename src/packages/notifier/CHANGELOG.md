# @open-pioneer/notifier

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

### Patch Changes

- 6416dd9: Very slightly defer toast creation (using `queueMicrotask()`).
  This prevents a React warning when calling `NotificationService.notify(..)` from within a `useEffect()`.
- Updated dependencies [eb54023]
    - @open-pioneer/core@4.3.0
    - @open-pioneer/react-utils@4.3.0
    - @open-pioneer/runtime@4.3.0

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- Updated dependencies [81308c0]
- Updated dependencies [0bcda89]
- Updated dependencies [1b95a62]
    - @open-pioneer/runtime@4.2.0
    - @open-pioneer/core@4.2.0
    - @open-pioneer/react-utils@4.2.0

## 4.1.0

### Minor Changes

- 3c6191a: Icons have been changed to Lucide react-icons to unify the appearance of the components.

### Patch Changes

- b7a854d: Update dependencies
- adf277b: Update dependencies
- Updated dependencies [b7a854d]
- Updated dependencies [3881d08]
- Updated dependencies [2da02e7]
- Updated dependencies [adf277b]
    - @open-pioneer/core@4.1.0
    - @open-pioneer/react-utils@4.1.0
    - @open-pioneer/runtime@4.1.0

## 4.0.0

### Major Changes

- 9f074d8: Update to Chakra 3.x
- 9f074d8: **Breaking**: The `position` property has moved from the `<Notifier />` component to package properties.
  In order to change to location of notifications, you need to customize the package properties.

    Before:

    ```jsx
    // App.jsx
    <Notifier position="top-right" />
    ```

    After:

    ```ts
    // app.ts
    const Element = createCustomElement({
        // ...
        config: {
            properties: {
                "@open-pioneer/notifier": {
                    position: "top-right"
                } satisfies NotifierProperties
            }
        }
        // or use resolveConfig()
    });
    ```

### Patch Changes

- 434bd04: Bump dependencies.
- Updated dependencies [9f074d8]
- Updated dependencies [9a2967c]
- Updated dependencies [434bd04]
- Updated dependencies [53c92ba]
- Updated dependencies [9f074d8]
- Updated dependencies [a5177fc]
    - @open-pioneer/react-utils@4.0.0
    - @open-pioneer/runtime@4.0.0
    - @open-pioneer/core@4.0.0

## 3.1.0

### Patch Changes

- 1c1ede8: Bump dependencies.
- Updated dependencies [248dab0]
- Updated dependencies [1c1ede8]
    - @open-pioneer/runtime@3.1.0
    - @open-pioneer/chakra-integration@3.1.0
    - @open-pioneer/core@3.1.0
    - @open-pioneer/react-utils@3.1.0

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
    - @open-pioneer/react-utils@3.0.0
    - @open-pioneer/runtime@3.0.0

## 2.4.0

### Minor Changes

- e4ba048: Introduce new convenience methods on the `NotificationService` in addition to the existing `notify()` method:

    ```js
    const notifier = ...; // injected
    notifier.success(/* ... */)
    notifier.info(/* ... */)
    notifier.warning(/* ... */)
    notifier.error(/* ... */)
    ```

### Patch Changes

- 1b63ebe: Update dependencies
- Updated dependencies [1b63ebe]
- Updated dependencies [e3802fb]
- Updated dependencies [ac39468]
- Updated dependencies [e3802fb]
    - @open-pioneer/chakra-integration@2.4.0
    - @open-pioneer/react-utils@2.4.0
    - @open-pioneer/core@2.4.0
    - @open-pioneer/runtime@2.4.0

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

- Updated dependencies [2fbaaa0]
    - @open-pioneer/chakra-integration@2.3.0
    - @open-pioneer/react-utils@2.3.0
    - @open-pioneer/runtime@2.3.0
    - @open-pioneer/core@2.3.0

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.
- Updated dependencies [39dad46]
    - @open-pioneer/chakra-integration@2.2.0
    - @open-pioneer/core@2.2.0
    - @open-pioneer/react-utils@2.2.0
    - @open-pioneer/runtime@2.2.0

## 0.3.6

### Patch Changes

- 5c62522: Update wording and harmonize structure
- Updated dependencies [5c62522]
- Updated dependencies [58ce24f]
- Updated dependencies [50550d3]
- Updated dependencies [e0b2fae]
- Updated dependencies [6cc7fcd]
    - @open-pioneer/chakra-integration@1.1.4
    - @open-pioneer/react-utils@1.0.1
    - @open-pioneer/core@1.3.0
    - @open-pioneer/runtime@2.1.7

## 0.3.5

### Patch Changes

- Updated dependencies [a208b32]
- Updated dependencies [a208b32]
- Updated dependencies [e945264]
    - @open-pioneer/react-utils@1.0.0
    - @open-pioneer/runtime@2.1.6

## 0.3.4

### Patch Changes

- Updated dependencies [90d0cce]
- Updated dependencies [90d0cce]
    - @open-pioneer/runtime@2.1.5

## 0.3.3

### Patch Changes

- 64645aa: Update to react 18.3
- Updated dependencies [5d3aafd]
- Updated dependencies [64645aa]
- Updated dependencies [64645aa]
- Updated dependencies [b3c60f2]
    - @open-pioneer/core@1.2.3
    - @open-pioneer/chakra-integration@1.1.3
    - @open-pioneer/runtime@2.1.4

## 0.3.2

### Patch Changes

- 5ff8f30: Update package.json metadata.
- Updated dependencies [5ff8f30]
    - @open-pioneer/chakra-integration@1.1.2
    - @open-pioneer/runtime@2.1.3
    - @open-pioneer/core@1.2.2

## 0.3.1

### Patch Changes

- 4eac7c7: Move packages into core-packages repository.
    - @open-pioneer/runtime@2.1.2

## 0.3.0

### Minor Changes

- ee7c2d4: Update runtime version.

### Patch Changes

- Updated dependencies [762e7b9]
    - @open-pioneer/react-utils@0.2.1

## 0.2.0

### Minor Changes

- 70349a8: Update to new core packages major versions

### Patch Changes

- Updated dependencies [70349a8]
    - @open-pioneer/react-utils@0.2.0

## 0.1.0

### Minor Changes

- 182da1c: Initial release.

### Patch Changes

- Updated dependencies [182da1c]
    - @open-pioneer/react-utils@0.1.0
