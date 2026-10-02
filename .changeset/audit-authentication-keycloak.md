---
"@open-pioneer/authentication-keycloak": patch
---

A few minor fixes while cleaning up the code:

- The plugin reads the notification texts from `currentIntl`, so it no longer triggers the `ServiceOptions.intl` deprecation warning.
- The plugin no longer starts the token refresh timer or shows a notification when the service was destroyed while `keycloak.init()` was still pending.
