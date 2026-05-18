---
"@open-pioneer/runtime": minor
---

Support for hot reloading of i18n messages (requires updated vite plugin).
When i18n messages are updated:

- React components rerender automatically with new `intl` object returned by `useIntl()`.
- Services that use the new `serviceOptions.currentIntl` interface also receive a new `intl` object (if they are watching for changes).
- Services that that still use the deprecated `serviceOptions.intl` interface cause the application to reload instead.
