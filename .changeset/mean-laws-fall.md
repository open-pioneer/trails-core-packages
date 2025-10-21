---
"@open-pioneer/test-utils": minor
---

The `createService` helper no longer returns a promise.
It can now be used in a synchronous fashion (no `await`).

Note that this change is backwards compatible.
But if you have been using this function in your code, you can simply remove the `await`.

It originally returned a promise to support (future) asynchronous initialization of services,
which has not been implemented and seems not to be needed.

Example:

```ts
// In your unit tests:
import { createService } from "@open-pioneer/test-utils/services";

const service = createService(MyServiceClass, options);
```
