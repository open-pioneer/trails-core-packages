---
"@open-pioneer/runtime": minor
---

Add `runtime.LocaleService` and opt-in reactive locale switching.

- `locale`: `Intl.Locale` for formatting.
- `messageLocale`: locale of the loaded bundle.
- `changeLocale(locale)`: best-fit match; throws `UNSUPPORTED_LOCALE` on no match. `undefined` resets to automatic picking.
- `supportsLocale(locale)`: true iff best-fit resolves to a supported bundle (regional variants accepted).
- Empty supported set normalizes to `["en"]`.

Also exports `parseLocale`, `tryParseLocale`, `getLocaleVariants`.
