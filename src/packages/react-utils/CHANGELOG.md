# @open-pioneer/react-utils

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

## 2.4.0

### Patch Changes

- 1b63ebe: Update dependencies
- Updated dependencies [1b63ebe]
- Updated dependencies [e3802fb]
    - @open-pioneer/chakra-integration@2.4.0
    - @open-pioneer/core@2.4.0

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

- Updated dependencies [2fbaaa0]
    - @open-pioneer/chakra-integration@2.3.0
    - @open-pioneer/core@2.3.0

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.
- Updated dependencies [39dad46]
    - @open-pioneer/chakra-integration@2.2.0
    - @open-pioneer/core@2.2.0

## 1.0.1

### Patch Changes

- 5c62522: Update wording and harmonize structure
- e0b2fae: Update dependencies
- Updated dependencies [5c62522]
- Updated dependencies [50550d3]
- Updated dependencies [e0b2fae]
    - @open-pioneer/chakra-integration@1.1.4
    - @open-pioneer/core@1.3.0

## 1.0.0

### Major Changes

- a208b32: **Breaking:** Removed the `ToolButton` component; it has moved to `@open-pioneer/map-ui-components`.

    If you were previously using the `ToolButton` in your app, you need to update your import statements when updating to this version:

    ```diff
    - import { ToolButton } from "@open-pioneer/react-utils";
    + import { ToolButton } from "@open-pioneer/map-ui-components";
    ```

    You need to update your `package.json` as well to refer to the `map-ui-components` package.

### Minor Changes

- a208b32: Move this package to the core-packages repository.

## 0.2.3

### Patch Changes

- 4140646: Update trails dependencies
- 4140646: Update to react 18.3.1
- 81bc7da: Update trails dependencies
- 2c092dc: Update dependencies
- 4140646: Add `sectionHeadingProps` to configure the generated `<SectionHeading>` if `title` is a string.

    For example:

    ```tsx
    <TitledSection title="some title" sectionHeadingProps={{ size: "lg" }}>
        ... Titled content ...
    </TitledSection>
    ```

## 0.2.2

### Patch Changes

- 1a8ad89: Update package.json metadata

## 0.2.1

### Patch Changes

- 762e7b9: Add 'aria-pressed' attribute to "pressable" tool buttons (when `isActive` is `true` or `false`).

## 0.2.0

### Minor Changes

- 70349a8: Update to new core packages major versions

## 0.1.0

### Minor Changes

- 182da1c: Initial release.
