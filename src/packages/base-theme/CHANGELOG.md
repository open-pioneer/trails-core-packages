# @open-pioneer/base-theme

## 4.5.0

### Minor Changes

- 89d743b: Support for color modes (light and dark).
  The default color mode remains `light` for backwards compatibility.
- 4e76893: Update Chakra UI to 3.34.0

### Patch Changes

- bdce509: Set cursor to 'pointer' on interactive calendar/datepicker elements.
- bdce509: Ensure buttons in colorPalettes red and green have a slightly different color when hovered.

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0

### Patch Changes

- f9aaf46: Bump various dependencies
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

### Patch Changes

- eb54023: Make sure that interactive elements (checkboxes, sliders, options, ...) use the 'pointer' cursor.

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
- 9f074d8: **Breaking**: The export name has changed from `theme` to `config`.

### Patch Changes

- b5f25d8: Use slightly darker `solid` background colors for color palettes `red`, `orange` and `green`.
  This improves contrast for toasts and other alert-like widgets.
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

## 0.3.3

## 0.3.2

### Patch Changes

- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.

## 0.3.1

### Patch Changes

- be236af: Remove unused button variants and color scheme from base-theme.
- 5ff8f30: Update package.json metadata.

## 0.3.0

### Minor Changes

- 6380aa4: Merge developments from @open-pioneer/theme.
  This package now provides the `"trails"` color scheme, among other things.

## 0.2.0

### Minor Changes

- 6f954e3: Compatibility with @open-pioneer/runtime@^2

## 0.1.0

### Minor Changes

- 6632892: Initial release.
