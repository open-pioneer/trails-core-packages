---
"@open-pioneer/reactivity": minor
---

Initial release.

You can use the hook `useReactiveSnapshot` to write React components that make use of the reactivity API of [@conterra/reactivity-core](https://www.npmjs.com/package/@conterra/reactivity-core).
Quick example:

```tsx
export function YourComponent({ model }) {
    // model is implemented using the reactivity API
    const fullName = useReactiveSnapshot(() => {
        return `${model.firstName} ${model.lastName}`;
    }, [model]);

    // Name is automatically kept up-to-date.
    return <div>Hello {fullName}</div>;
}
```

The reactivity API is not directly used in any trails packages at this time.
However, moving forward, most packages will use the reactivity API as _the_ common reactivity system.
