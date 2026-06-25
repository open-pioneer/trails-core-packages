---
"@open-pioneer/runtime": minor
---

Add `runtime.LocaleService` and opt-in reactive locale switching.

- `locale`: `Intl.Locale` for formatting.
- `messageLocale`: locale of the loaded i18n messages.
- `changeLocale(locale)`: best-fit match; throws `UNSUPPORTED_LOCALE` on no match. `undefined` resets to automatic picking.
- `supportsLocale(locale)`: true iff best-fit resolves to a supported message locale (regional variants accepted).
- Empty supported set normalizes to `["en"]`.

Also export `parseLocale` and `tryParseLocale` algorithms.
These can be used to construct a (cleaned up) `Intl.Locale` object from a string.
