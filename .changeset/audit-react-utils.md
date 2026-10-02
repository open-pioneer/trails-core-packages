---
"@open-pioneer/react-utils": patch
---

Fix three roving menu issues:

- Pressing `End` in a menu whose current item is unknown now moves to the last item instead of the first.
- Keyboard navigation uses `getAttribute("aria-disabled")` to skip disabled nodes instead of reading the `ariaDisabled` property.
- `useRovingMenuItem({ disabled: true })` now returns `itemProps` with `aria-disabled="true"`. Previously the item element had to carry the attribute itself to be skipped during keyboard navigation.
