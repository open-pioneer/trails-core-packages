# @open-pioneer/local-storage

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

## 0.3.6

### Patch Changes

- 5c62522: Update wording and harmonize structure

## 0.3.5

## 0.3.4

## 0.3.3

### Patch Changes

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

- 3ca8a25: Initial release

## 0.2.0

### Minor Changes

- 70349a8: Update to new core packages major versions

## 0.1.0

### Minor Changes

- 3ca8a25: Initial release
