---
"@open-pioneer/notifier": major
---

**Breaking**: The `position` property has moved from the `<Notifier />` component to package properties.
In order to change to location of notifications, you need to customize the package properties.

Before:

```jsx
// App.jsx
<Notifier position="top-right" />
```

After:

```ts
// app.ts
const Element = createCustomElement({
    // ...
    config: {
        properties: {
            "@open-pioneer/notifier": {
                position: "top-right"
            } satisfies NotifierProperties
        }
    }
    // or use resolveConfig()
});
```
