---
"@open-pioneer/runtime": minor
---

Add `runtime.LocaleService` and opt-in reactive locale switching.

You can opt-in by configuring the property `advanced.enableLiveLocaleChanges` when calling `createCustomElement`.
Once enabled, locale switches can be done without restarting the application.
Use `LocaleService.changeLocale` to update the application's locale.

Also export `parseLocale` and `tryParseLocale` algorithms.
These can be used to construct a (cleaned up) `Intl.Locale` object from a string.
