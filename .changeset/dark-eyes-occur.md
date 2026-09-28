---
"@open-pioneer/local-storage": minor
---

Add a new `SessionStorageService` based on the browser's [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
The new service has the same API as the `LocalStorageService`.

Reference the interface name `local-storage.SessionStorageService` to inject an instance of the new service.

The storage API types have been renamed to storage-kind-neutral names: `StorageAPI`, `StorageNamespace`, `StorageProperties` and the new common interface `StorageService`.
The previous names `LocalStorageAPI`, `LocalStorageNamespace` and `LocalStorageProperties` are still valid, but have been marked as deprecated.
