# @open-pioneer/test-utils

## 4.5.0

### Minor Changes

- 89d743b: Support for color modes (light and dark).
  The default color mode remains `light` for backwards compatibility.
- 4e76893: Update Chakra UI to 3.32.0

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0

### Patch Changes

- f9aaf46: Bump various dependencies
- 9c4ff00: Apply chakra theme correctly when rendering react components in (browser-) tests within the `PackageContextProvider`.
  Previously, chakra components were actually unstyled.
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

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

## 4.1.0

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

### Patch Changes

- 1b63ebe: Update dependencies

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.

## 1.1.4

### Patch Changes

- e0b2fae: Update dependencies

## 1.1.3

### Patch Changes

- 64645aa: Update to react 18.3
- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.

## 1.1.2

### Patch Changes

- 5ff8f30: Update package.json metadata.

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

## 1.0.1

## 1.0.0

### Major Changes

- 22ff68a: Initial release

## 0.1.6

### Patch Changes

- 9eac5c9: Use peer dependencies for (most) dependencies

## 0.1.5

### Patch Changes

- 5e08907: Don't show MISSING_TRANSLATION errors when testing components or services.

## 0.1.4

### Patch Changes

- 49ba4e1: Use build-package CLI to build.

## 0.1.3

### Patch Changes

- e752d49: Use new runtime-react-support package

## 0.1.2

### Patch Changes

- a40f12d: Update build-package tool. TypeScript declaration files should now be available.

## 0.1.1

### Patch Changes

- e1c7295: Compiled with build-package 0.5.2

## 0.1.0

### Minor Changes

- 77f7d5c: Initial test release
