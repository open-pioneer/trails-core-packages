# @open-pioneer/chakra-snippets

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0
- 20165aa: Add new snippet `splitter.tsx`.

### Patch Changes

- f9aaf46: Bump various dependencies
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.
- 4c77ad4: Fix missing entry points in typedoc documentation.
- 4c77ad4: Add missing entry point `tags-input`. The snippet could not be imported previously.
- Updated dependencies [f9aaf46]
- Updated dependencies [b28d6bc]
- Updated dependencies [554d58e]
- Updated dependencies [1cc3415]
- Updated dependencies [1872a6d]
- Updated dependencies [84068f2]
    - @open-pioneer/core@4.4.0
    - @open-pioneer/runtime@4.4.0

## 4.3.0

### Minor Changes

- 0c278f6: Update snippets.

    New snippets:
    - `carousel`
    - `combobox`
    - `tags-input`

    Updated snippets:
    - `toggle-tip`: Now accepts `contentProps` prop, `portalRef` can refer to `null`
    - `tooltip`: `portalRef` can refer to `null`

- eb54023: Update chakra to 3.29.0

### Patch Changes

- Updated dependencies [eb54023]
    - @open-pioneer/core@4.3.0
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

## 4.1.0

### Patch Changes

- b7a854d: Update dependencies
- 3881d08: - Update Chakra UI from 3.22.0 to 3.24.2
    - Update to latest Chakra snippets
- adf277b: Update dependencies
- Updated dependencies [b7a854d]
- Updated dependencies [3881d08]
- Updated dependencies [2da02e7]
- Updated dependencies [adf277b]
    - @open-pioneer/core@4.1.0
    - @open-pioneer/runtime@4.1.0

## 4.0.0

### Major Changes

- 9f074d8: Initial release

### Patch Changes

- 434bd04: Bump dependencies.
- Updated dependencies [9f074d8]
- Updated dependencies [434bd04]
- Updated dependencies [53c92ba]
- Updated dependencies [9f074d8]
    - @open-pioneer/runtime@4.0.0
    - @open-pioneer/core@4.0.0
