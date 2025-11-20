# Devnotes

The snippets in the root directory of this package are sometimes slightly modified from their base version.
The changes are clearly marked with comments.

We also save the original versions of the snippets in the `unedited` directory.

## Steps to update snippets

1. Run `pnpm run update-snippets` from the package directory.
   This will download the latest snippets using the chakra CLI into the `unedited` directory.
   Snippets we don't need will automatically be deleted (see blacklist in `build-utils/update-snippets.ts`).
2. Check whether the snippets have been updated (new snippets, changes in existing ones).
   If necessary, include the new snippets or update the "real" snippets, preserving our local modifications.
    - If a new snippet has been added, add it to the `build.config.mjs` as an entry point.
    - Also include it in the `typedoc.json`.
    - Make sure to keep the README in sync

3. If a snippet has been changed in a breaking way, consider maintaining multiple versions of that snippet
   for backwards compatibility. For example, `PasswordInput` and `PasswordInputV2`.

4. Chakra's CLI may manipulate `package.json` files or pnpm files.
   These changes can very likely be reverted.
   But you need to check whether snippets need any new dependencies.
   (NOTE: `next-themes` is not required as a dependency. We don't use that theming mechanism.)
