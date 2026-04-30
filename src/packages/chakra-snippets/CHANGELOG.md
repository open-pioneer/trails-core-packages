# @open-pioneer/chakra-snippets

## 4.6.0

### Patch Changes

- 0ac098b: Fix keyboard focus when a button is sometimes surrounded with a tooltip and sometimes not.
  Previously the button would lose focus when pressing the Enter key:

    ```tsx
    <Tooltip
        content={/* ... */}
        disabled={expanded} // enabled/disabled based on dynamic condition
    >
        <Button onClick={toggleExpanded}>...</Button>
    </Tooltip>
    ```

## 4.5.0

### Minor Changes

- 4e76893: Update Chakra UI to 3.34.0
- 6e3760b: Update chakra to version 3.34.0.
  Snippets have been checked and are still up to date.

### Patch Changes

- 4e76893: Add translations for aria labels in `Carousel` and `PasswordInput` snippets.

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0
- 20165aa: Add new snippet `splitter.tsx`.

### Patch Changes

- f9aaf46: Bump various dependencies
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.
- 4c77ad4: Fix missing entry points in typedoc documentation.
- 4c77ad4: Add missing entry point `tags-input`. The snippet could not be imported previously.

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

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

## 4.1.0

### Patch Changes

- b7a854d: Update dependencies
- 3881d08: - Update Chakra UI from 3.22.0 to 3.24.2
    - Update to latest Chakra snippets
- adf277b: Update dependencies

## 4.0.0

### Major Changes

- 9f074d8: Initial release

### Patch Changes

- 434bd04: Bump dependencies.
