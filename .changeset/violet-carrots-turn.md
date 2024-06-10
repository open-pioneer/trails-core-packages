---
"@open-pioneer/runtime": patch
---

Add a builtin method on the `ApplicationContext` to change the application's locale.
Note that with the current implementation, the application will simply restart with the new locale.
The application's state will be lost.

Example:

```ts
import { ApplicationContext } from "@open-pioneer/runtime";

const appCtx: ApplicationContext = ...; // injected
appCtx.setLocale("en-US");
```
