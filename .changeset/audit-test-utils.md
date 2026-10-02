---
"@open-pioneer/test-utils": patch
---

`PackageContextProvider` keeps its package context stable across re-renders with equal props, so `useIntl()` and `useService()` return the same objects.
