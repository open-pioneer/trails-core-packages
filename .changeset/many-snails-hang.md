---
"@open-pioneer/notifier": minor
---

Introduce new convenience methods on the `NotificationService` in addition to the existing `notify()` method:

```js
const notifier = ...; // injected
notifier.success(/* ... */)
notifier.info(/* ... */)
notifier.warning(/* ... */)
notifier.error(/* ... */)
```
