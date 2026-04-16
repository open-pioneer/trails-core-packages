---
"@open-pioneer/chakra-snippets": patch
---

Fix keyboard focus when a button is sometimes surrounded with a tooltip and sometimes not.
Previously the button would lose focus when pressing the Enter key:

```tsx
<Tooltip
    content={/* ... */}
    disabled={expanded} // enabled/disabled based on dynamic condition
>
    <Button onClick={toggleExpanded}>...</Button>
</Tooltip>
```
