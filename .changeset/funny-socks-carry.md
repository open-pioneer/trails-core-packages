---
"@open-pioneer/react-utils": major
---

**Breaking:** Removed the `ToolButton` component; it has moved to `@open-pioneer/map-tools`.

If you were previously using the `ToolButton` in your app, you need to update your import statements when updating to this version:

```diff
- import { ToolButton } from "@open-pioneer/react-utils";
+ import { ToolButton } from "@open-pioneer/map-tools";
```

You need to update your `package.json` as well to refer to the `map-tools` package.
