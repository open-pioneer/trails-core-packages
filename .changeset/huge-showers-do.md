---
"@open-pioneer/authentication-keycloak": minor
---

Support configuration of keycloak's login options and logout options.

For example, to redirect to a different site after logout:

```ts
// app.ts
const element = createCustomElement({
    component: AppUI,
    appMetadata,
    config: {
        properties: {
            "@open-pioneer/authentication-keycloak": {
                keycloakOptions: {
                    // ...
                    keycloakLogoutOptions: {
                        redirectUri: "https://example.com"
                    }
                }
            } satisfies KeycloakProperties
        },
        locale: FORCED_LANG
    }
});
```

The plugin also supports options for the `logout` method to supply dynamic logout options:

```ts
// via auth service
const authService = ...;
authService.logout({
    // These are passed directly the keycloak plugin (if it is being used).
    pluginOptions: {
        redirectUri: "https://example.com",
    }
})

// via direct reference to the plugin ("authentication-keycloak.KeycloakAuthPlugin")
const keycloakAuthPlugin = ...;
keycloakAuthPlugin.logout({
    redirectUri: "https://example.com",
});
```
