---
"@open-pioneer/authentication-keycloak": minor
---

Make `RefreshOptions` optional with sensible default values.

- `autoRefresh`: true
- `interval` (for token lifetime checks): 10 seconds
- `timeLeft`: 60 seconds (minimum required lifetime during token validity checks)

These values are used when they are not explicitly configured using package properties.
