# @open-pioneer/react-utils

## 4.5.0

### Minor Changes

- 4e76893: Update Chakra UI to 3.34.0
- d523ade: Add more properties to the `CommonComponentProps` interface.
  Previously, trails components only allowed customizing the `className`.

    Now, these additional properties are supported:
    - `role`: the ARIA role
    - `aria-*`: arbitrary ARIA attributes
    - `data-*`: arbitrary JavaScript values
    - `css`: additional Chakra style rules

    NOTE: Defining these values may overwrite existing behavior of a component if values cannot be merged.
    For example, overriding an existing `data-` property may break a component.

- d523ade: Implement `mergeChakraProps` helper to merge multiple props objects.
- 604a589: Provide an implementation of the roving tab index pattern for menus ("Roving Menu").
  This roving menu can be used to implement accessible menus with support for keyboard navigation.
    - Supports plain menus (e.g. toolbars, sidebars, ...)
    - Supports simple cases of nesting (horizontal menu in vertical menu, or the other way around)

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0

### Patch Changes

- f9aaf46: Bump various dependencies
- 7087ea7: Support calling `useEvent()` callbacks in `useInsertionEffect()` or similar timings. Previously, `useEvent()` only worked correctly when used in `useLayoutEffect()` or later.
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

## 4.1.0

### Patch Changes

- b7a854d: Update dependencies
- adf277b: Update dependencies

## 4.0.0

### Major Changes

- 9f074d8: Update to Chakra 3.x

### Minor Changes

- a5177fc: Allow using `SectionHeading` in the children of a `TitledSection` instead of the `title` prop.
  This is more flexible and more readable compared to complex components in the `title` prop.

    For example:

    ```jsx
    <TitledSection>
        <SectionHeading>Top level heading (H1)</SectionHeading>
        .. Some Content ..
        <TitledSection>
            <Box backgroundColor="green.500">
                <SectionHeading>Other Heading (H2)</SectionHeading>
            </Box>
            .. More Content ..
        </TitledSection>
    </TitledSection>
    ```

    Note that you should be using exactly one `<SectionHeading />` for each `<TitledSection />`.

### Patch Changes

- 9a2967c: Remove the prop `substituteHeadingLevel` from the `TitledSectionProps` interface.
  The property was mistakenly documented, but was never implemented.
  You can use the `<ConfigureTitledSection />` component instead.
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

## 1.0.1

### Patch Changes

- 5c62522: Update wording and harmonize structure
- e0b2fae: Update dependencies

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
