---
"@open-pioneer/runtime": minor
---

Add support for rich text formatting using the `intl` object.
In addition to primitive values, rich text formatting supports react values and custom react tags.
It always returns a react node, so can only be used in combination with react components.

_Example with react node as value:_

```tsx
function Example() {
    const intl = useIntl();
    // Given i18n message "Hello, {name}!"
    // replaces 'name' with the given react node:
    const message = intl.formatRichMessage(
        { id: "foo" },
        {
            name: <FancyUserName />
        }
    );
    return <Box>{message}</Box>;
}
```

_Example with basic formatting:_

```tsx
function Example() {
    const intl = useIntl();
    // Given i18n message "Hello, <strong>{name}</strong>!"
    // renders with actual <strong> html node:
    return <Box>{intl.formatRichMessage({ id: "foo" }, { name: "User" })}</Box>;
}
```

Note that only a few basic formatting tags are predefined ("b", "strong", "i", "em", "code", "br").
If you need more advanced tags, you can define your own, see below.
_Example with custom tag:_

```tsx
function Example() {
    const intl = useIntl();
    // Given i18n message "Open <foo>the door</foo>!",
    // renders 'foo' using the formatter function below:
    const message = intl.formatRichMessage(
        { id: "foo" },
        {
            foo: (parts) => <FancyTag>{parts}</FancyTag>
        }
    );
    return <Box>{message}</Box>;
}
```
