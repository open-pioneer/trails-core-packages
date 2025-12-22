---
"@open-pioneer/react-utils": patch
---

Support calling `useEvent()` callbacks in `useInsertionEffect()` or similar timings. Previously, `useEvent()` only worked correctly when used in `useLayoutEffect()` or later.
