---
"@open-pioneer/react-utils": minor
---

# Description

Added an `required` option to `useHeadingLevel` hook to make it return `undefined` instead of throwing an error when used outside of a `TitledSection`.

This allows to use the hook in components which do not necessarily need to be used inside a `TitledSection`, while still providing the option to enforce that usage when desired.

Example usage:

```tsx
const MyComponent = () => {
    const currentHeading: number | undefined = useHeadingLevel({ required: false });
    if (currentHeading === undefined) {
        return <span>No heading level</span>;
    }
    const currentHeadingText = `Current heading is ${currentHeading}`;
    return <span>{currentHeadingText}</span>;
};
```
