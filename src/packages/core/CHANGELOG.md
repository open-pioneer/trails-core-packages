# @open-pioneer/core

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

- e3802fb: Introduce the `NumberParser` class for parsing strings in a specified locale.

    ```js
    import { NumberParser } from "@open-pioneer/core";

    const parser = new NumberParser("de-DE");
    const number = parser.parse("1.234,56");
    ```

### Patch Changes

- 1b63ebe: Update dependencies

## 2.3.0

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.

## 1.3.0

### Minor Changes

- 50550d3: Add `destroyResources(resources)` to destroy an array of resources.

### Patch Changes

- 5c62522: Update wording and harmonize structure

## 1.2.3

### Patch Changes

- 5d3aafd: Harmonize references to Open Pioneer Trails in README.

## 1.2.2

### Patch Changes

- 5ff8f30: Update package.json metadata.

## 1.2.1

### Patch Changes

- 11b1428: Export `rethrowAbortError` from core package and use it correctly in `HttpService`.

## 1.2.0

### Minor Changes

- a18d227: New helper function `rethrowAbortError`.

## 1.1.0

### Minor Changes

- 69c0fcd: The Logger interface now supports `unknown` as message argument. Value types other than `string` or `Error` are converted to strings before logging them.

## 1.0.1

### Patch Changes

- 88fd710: fix typings EventNames type

## 1.0.0

### Major Changes

- 22ff68a: Initial release

## 0.1.4

### Patch Changes

- 9eac5c9: Use peer dependencies for (most) dependencies

## 0.1.3

### Patch Changes

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
