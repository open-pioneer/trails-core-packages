---
"@open-pioneer/core": minor
---

Introduce the `NumberParser` class for parsing strings in a specified locale.

```js
import { NumberParser } from "@open-pioneer/core";

const parser = new NumberParser("de-DE");
const number = parser.parse("1.234,56");
```
