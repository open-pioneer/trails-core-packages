---
"@open-pioneer/react-utils": minor
---
Added a `required` option to `useHeadingLevel` hook to make it return `undefined` instead of throwing an error when used outside of a `TitledSection`.

This allows to use the hook in components which do not necessarily need to be used inside a `TitledSection`.

```tsx
const currentHeading: number | undefined = useHeadingLevel({ required: false });
```
