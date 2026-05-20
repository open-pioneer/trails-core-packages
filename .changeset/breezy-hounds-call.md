---
"@open-pioneer/runtime": minor
"@open-pioneer/core": minor
---

Add shallowEquals and deepEquals helper.

Examples:

```ts
shallowEquals({ a: 1 }, { a: 1 }); // true
shallowEquals({ a: { x: 1 } }, { a: { x: 1 } }); // false
deepEquals({ a: { x: 1 } }, { a: { x: 1 } }); // true
deepEquals([1, [2, 3]], [1, [2, 3]]); // true
```
