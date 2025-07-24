---
"@open-pioneer/authentication": minor
---

New `options` parameter for the `logout` method of `AuthService`.

This will allow you to pass custom options that may be supported by the active authentication plugin.

```ts
const authService = ...; // injected
authService.logout({
    // Interpretation of this parameter highly depends on the active authentication plugin.
    pluginOptions: {
        redirectUri: "https://example.com"
    }
})
```
