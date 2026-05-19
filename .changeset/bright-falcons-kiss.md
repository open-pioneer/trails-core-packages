---
"@open-pioneer/react-utils": minor
---

Add new `FormattedMessage` and `FormattedRichMessage` components.
These components render translated messages using `intl.formatMessage` / `intl.formatRichMessage`
and support reactive changes of the `intl` property.

Example:

```tsx
// currentIntl can be a signal
<FormattedMessage intl={currentIntl} id="message.id" />
```
