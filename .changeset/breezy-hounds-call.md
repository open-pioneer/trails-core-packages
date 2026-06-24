---
"@open-pioneer/core": minor
---

Add shallowEquals and deepEquals helper.

Examples:

```ts
import { shallowEquals, deepEquals } from "@open-pioneer/core";

shallowEquals({ a: 1 }, { a: 1 }); // true
shallowEquals({ a: { x: 1 } }, { a: { x: 1 } }); // false
deepEquals({ a: { x: 1 } }, { a: { x: 1 } }); // true
deepEquals([1, [2, 3]], [1, [2, 3]]); // true
```
