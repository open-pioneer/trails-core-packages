---
"@open-pioneer/react-utils": minor
---

Add more properties to the `CommonComponentProps` interface.
Previously, trails components only allowed customizing the `className`.

Now, these additional properties are supported:

- `role`: the ARIA role
- `aria-*`: arbitrary ARIA attributes
- `data-*`: arbitrary JavaScript values
- `css`: additional Chakra style rules

NOTE: Defining these values may overwrite existing behavior of a component if values cannot be merged.
For example, overriding an existing `data-` property may break a component.
