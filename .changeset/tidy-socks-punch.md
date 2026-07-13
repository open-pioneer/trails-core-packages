---
"@open-pioneer/runtime": patch
---

Fix 'useIntl' not transporting reactive changes of the intl object in production (e.g. when the locale changes).
