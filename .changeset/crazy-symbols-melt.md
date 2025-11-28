---
"@open-pioneer/authentication-keycloak": patch
"@open-pioneer/chakra-snippets": patch
"@open-pioneer/authentication": patch
"@open-pioneer/local-storage": patch
"@open-pioneer/integration": patch
"@open-pioneer/react-utils": patch
"@open-pioneer/base-theme": patch
"@open-pioneer/reactivity": patch
"@open-pioneer/test-utils": patch
"@open-pioneer/notifier": patch
"@open-pioneer/runtime": patch
"@open-pioneer/core": patch
"@open-pioneer/http": patch
---

Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.
