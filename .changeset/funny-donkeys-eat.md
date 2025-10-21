---
"@open-pioneer/notifier": patch
---

Very slightly defer toast creation (using `queueMicrotask()`).
This prevents a React warning when calling `NotificationService.notify(..)` from within a `useEffect()`.
