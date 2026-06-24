---
"@open-pioneer/core": minor
---

Add shallowEqual and deepEqual helper function to compare two objects.

Examples:

```ts
import { shallowEqual, deepEqual } from "@open-pioneer/core";

shallowEqual({ a: 1 }, { a: 1 }); // true
shallowEqual({ a: { x: 1 } }, { a: { x: 1 } }); // false
deepEqual({ a: { x: 1 } }, { a: { x: 1 } }); // true
deepEqual([1, [2, 3]], [1, [2, 3]]); // true
```
