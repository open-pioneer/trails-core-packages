---
"@open-pioneer/runtime": patch
---

Export `DECLARE_SERVICE_INTERFACE` as a value instead of a type only.
It was previously necessary to import this symbol via `import type` to avoid errors during development.
The `type` keyword can now be omitted.
