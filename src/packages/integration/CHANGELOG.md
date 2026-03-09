# @open-pioneer/integration

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

### Patch Changes

- 1b63ebe: Update dependencies

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.

## 2.0.10

### Patch Changes

- 5c62522: Update wording and harmonize structure
- 6cc7fcd: Allow synchronous `getApiMethods()` when implementing an `ApiExtension`.

## 2.0.9

## 2.0.8

## 2.0.7

### Patch Changes

- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.

## 2.0.6

### Patch Changes

- 5ff8f30: Update package.json metadata.

## 2.0.5

### Patch Changes

- @open-pioneer/runtime@2.1.2

## 2.0.4

## 2.0.3

## 2.0.2

### Patch Changes

- @open-pioneer/runtime@2.0.2

## 2.0.1

### Patch Changes

- @open-pioneer/runtime@2.0.1

## 2.0.0

### Major Changes

- 6f954e3: Compatibility with @open-pioneer/runtime@^2

## 1.0.3

## 1.0.2

### Patch Changes

- @open-pioneer/runtime@1.0.2

## 1.0.1

### Patch Changes

- @open-pioneer/runtime@1.0.1

## 1.0.0

### Major Changes

- 22ff68a: Initial release

## 0.1.4

### Patch Changes

- 9eac5c9: Use peer dependencies for (most) dependencies

## 0.1.3

### Patch Changes

- 234b3be: Fix registrations in ServiceRegistry
- 49ba4e1: Use build-package CLI to build.

## 0.1.2

### Patch Changes

- a40f12d: Update build-package tool. TypeScript declaration files should now be available.

## 0.1.1

### Patch Changes

- e1c7295: Compiled with build-package 0.5.2

## 0.1.0

### Minor Changes

- 77f7d5c: Initial test release
