---
"@open-pioneer/runtime": patch
---

Fix a set of smaller issues:

- `element.when()` rejects with an abort error when the app failed to start, also when it is called after the failure. Previously such a call returned a promise that never settled.
- The deprecated `ApplicationContext.setLocale()` throws `runtime:unsupported-locale` again for a string that is not a valid BCP 47 tag, instead of silently switching to automatic locale selection.
- `useService()` no longer repeats the service lookup on every render when an options object is passed inline.
- The development-only intl watch of a service is released when the service constructor throws, and the `AppIntl` instance is released when the app is destroyed during startup.
