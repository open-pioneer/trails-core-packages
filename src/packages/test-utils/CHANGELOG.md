# @open-pioneer/test-utils

## 4.5.0

### Minor Changes

- 4e76893: Update Chakra UI to 3.32.0

### Patch Changes

- Updated dependencies [4e76893]
- Updated dependencies [c866e13]
    - @open-pioneer/runtime@4.5.0

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0

### Patch Changes

- f9aaf46: Bump various dependencies
- 9c4ff00: Apply chakra theme correctly when rendering react components in (browser-) tests within the `PackageContextProvider`.
  Previously, chakra components were actually unstyled.
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.
- Updated dependencies [f9aaf46]
- Updated dependencies [b28d6bc]
- Updated dependencies [554d58e]
- Updated dependencies [1cc3415]
- Updated dependencies [1872a6d]
- Updated dependencies [84068f2]
    - @open-pioneer/runtime@4.4.0

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

### Patch Changes

- Updated dependencies [eb54023]
    - @open-pioneer/runtime@4.3.0

## 4.2.0

### Minor Changes

- 9fa7f7c: The `createService` helper no longer returns a promise.
  It can now be used in a synchronous fashion (no `await`).

    Note that this change is backwards compatible.
    But if you have been using this function in your code, you can simply remove the `await`.

    It originally returned a promise to support (future) asynchronous initialization of services,
    which has not been implemented and seems not to be needed.

    Example:

    ```ts
    // In your unit tests:
    import { createService } from "@open-pioneer/test-utils/services";

    const service = createService(MyServiceClass, options);
    ```

- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- 81308c0: Update to eslint 9
- Updated dependencies [81308c0]
- Updated dependencies [1b95a62]
    - @open-pioneer/runtime@4.2.0

## 4.1.0

### Patch Changes

- b7a854d: Update dependencies
- adf277b: Update dependencies
- Updated dependencies [b7a854d]
- Updated dependencies [3881d08]
- Updated dependencies [adf277b]
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
    - @open-pioneer/runtime@4.0.0

## 3.1.0

### Patch Changes

- 1c1ede8: Bump dependencies.
- Updated dependencies [248dab0]
- Updated dependencies [1c1ede8]
    - @open-pioneer/runtime@3.1.0
    - @open-pioneer/chakra-integration@3.1.0
    - @open-pioneer/runtime-react-support@3.1.0

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
    - @open-pioneer/runtime-react-support@3.0.0

## 2.4.0

### Patch Changes

- 1b63ebe: Update dependencies
- Updated dependencies [1b63ebe]
    - @open-pioneer/chakra-integration@2.4.0
    - @open-pioneer/runtime-react-support@2.4.0

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

- Updated dependencies [2fbaaa0]
    - @open-pioneer/runtime-react-support@2.3.0
    - @open-pioneer/chakra-integration@2.3.0

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.
- Updated dependencies [39dad46]
    - @open-pioneer/chakra-integration@2.2.0
    - @open-pioneer/runtime-react-support@2.2.0

## 1.1.4

### Patch Changes

- e0b2fae: Update dependencies
- Updated dependencies [5c62522]
- Updated dependencies [e0b2fae]
    - @open-pioneer/chakra-integration@1.1.4
    - @open-pioneer/runtime-react-support@1.0.2

## 1.1.3

### Patch Changes

- 64645aa: Update to react 18.3
- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.
- Updated dependencies [64645aa]
- Updated dependencies [64645aa]
- Updated dependencies [b3c60f2]
    - @open-pioneer/runtime-react-support@1.0.2
    - @open-pioneer/chakra-integration@1.1.3

## 1.1.2

### Patch Changes

- 5ff8f30: Update package.json metadata.
- Updated dependencies [5ff8f30]
    - @open-pioneer/runtime-react-support@1.0.1
    - @open-pioneer/chakra-integration@1.1.2

## 1.1.1

### Patch Changes

- b617e3b: Fix typo in readme

## 1.1.0

### Minor Changes

- 2d5a94a: Provide `createIntl` from `@open-pioneer/test-utils/vanilla` to make creation of a `PackageIntl` instance easier.

### Patch Changes

- @open-pioneer/runtime-react-support@1.0.0

## 1.0.2

### Patch Changes

- f5c0e31: Bump @formatjs/intl version
- f5c0e31: Bump @testing-library/\* dependencies
- Updated dependencies [f5c0e31]
    - @open-pioneer/chakra-integration@1.1.1
    - @open-pioneer/runtime-react-support@1.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [6632892]
    - @open-pioneer/chakra-integration@1.1.0
    - @open-pioneer/runtime-react-support@1.0.0

## 1.0.0

### Major Changes

- 22ff68a: Initial release

### Patch Changes

- Updated dependencies [22ff68a]
    - @open-pioneer/chakra-integration@1.0.0
    - @open-pioneer/runtime-react-support@1.0.0

## 0.1.6

### Patch Changes

- 9eac5c9: Use peer dependencies for (most) dependencies
- Updated dependencies [9eac5c9]
    - @open-pioneer/runtime-react-support@0.1.2
    - @open-pioneer/chakra-integration@0.1.4

## 0.1.5

### Patch Changes

- 5e08907: Don't show MISSING_TRANSLATION errors when testing components or services.

## 0.1.4

### Patch Changes

- 49ba4e1: Use build-package CLI to build.
- Updated dependencies [49ba4e1]
    - @open-pioneer/chakra-integration@0.1.3
    - @open-pioneer/runtime-react-support@0.1.1

## 0.1.3

### Patch Changes

- e752d49: Use new runtime-react-support package
- Updated dependencies [e752d49]
    - @open-pioneer/runtime-react-support@0.1.0

## 0.1.2

### Patch Changes

- a40f12d: Update build-package tool. TypeScript declaration files should now be available.
- Updated dependencies [a40f12d]
    - @open-pioneer/chakra-integration@0.1.2
    - @open-pioneer/runtime@0.1.2

## 0.1.1

### Patch Changes

- e1c7295: Compiled with build-package 0.5.2
- Updated dependencies [e1c7295]
    - @open-pioneer/chakra-integration@0.1.1
    - @open-pioneer/runtime@0.1.1

## 0.1.0

### Minor Changes

- 77f7d5c: Initial test release

### Patch Changes

- Updated dependencies [77f7d5c]
    - @open-pioneer/chakra-integration@0.1.0
    - @open-pioneer/runtime@0.1.0
