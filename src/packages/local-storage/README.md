# @open-pioneer/local-storage

This package provides access to the browser's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

It provides two services with an identical API, differing only in the lifetime and the visibility of their data:

| Service                 | Interface name                        | Lifetime                                   | Visibility                            |
| ----------------------- | ------------------------------------- | ------------------------------------------ | ------------------------------------- |
| `LocalStorageService`   | `local-storage.LocalStorageService`   | until explicitly removed                   | shared by all tabs of the same origin |
| `SessionStorageService` | `local-storage.SessionStorageService` | until the tab is closed (survives reloads) | the current tab only                  |

A single storage key (configurable, see [Configuration](#configuration)) is used to keep track of the application's data.
Packages using these services can work with arbitrary values (including nested data structures) through a convenient API.

> NOTE: Both services read their data from the browser on application startup.
> Changes made via a service are reflected in the browser's storage immediately.
> Concurrent changes made to the browser's storage **are not** reflected by the services.
> In other words, there is no two-way synchronization between the two systems while the application is running.
>
> You should not attempt to modify the storage value managed by these services (see `storageId` in [Configuration](#configuration)) through the "raw" Browser APIs while the application is running.
> Other keys are safe to use.

## Usage

Reference the interface name `local-storage.LocalStorageService` to inject an instance of `LocalStorageService`, or `local-storage.SessionStorageService` to inject an instance of `SessionStorageService`.

```js
// build.config.mjs
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    services: {
        MyService: {
            references: {
                localStorage: "local-storage.LocalStorageService",
                sessionStorage: "local-storage.SessionStorageService"
            }
        }
    }
});
```

### Checking for storage support

Not all browsers implement or enable support for local storage and session storage.
Use the `.isSupported` property to check whether the storage can be used at all:

```js
const storageService = ...; // injected
console.log(storageService.isSupported);
```

If the storage is not supported, other methods (such as `get()` and `set()`) throw an error.

### Reading and writing values

In its most basic form, you can use either service similar to a map.
In the background, changes to the service are always persisted into the browser's storage.

All values used in these services are serialized to JSON via `JSON.stringify()`.
Thus, only values supported by JSON can be used.

Example:

```js
const storageService = ...; // injected
storageService.set("foo", "bar");
storageService.set("foo", ["array"]);
storageService.set("foo", {
    nested: {
        object: "hello world"
    }
});
storageService.get("foo"); // returns (copy of) previous value
storageService.remove("foo");
storageService.removeAll();
```

### Namespaces

You can use either service to manage hierarchical data, including objects and arrays (see above).
_Namespaces_ can help you treat an object as a group of (nested) properties.
Getting or setting entries in the namespace update an object behind the scenes.

To use a namespace, call `getNamespace(key)` on either service or on another `StorageNamespace` object.
The `key` used in `getNamespace(key)` should either already be associated with an object or it should not be set to a value at all.
If `key` is not yet associated with an existing object, a new empty object is created.

Example:

```js
const storageService = ...; // injected
const namespace = storageService.getNamespace("my-key");
namespace.set("foo", "bar"); // actually sets `"my-key" -> "foo"`
```

`getNamespace("my-key")` returns a `StorageNamespace` instance that manipulates the object at `"my-key"`.

Namespaces provide a convenient way to scope your component's values, avoiding conflicts with other packages.
For example, you can use your package name as the namespace key:

```js
const storageService = ...; // injected
const namespace = storageService.getNamespace("my-package-name");
namespace.set("my-state", "some-value-to-save");
```

> NOTE: Multiple namespace instances using the same `key` manipulate the same object and see each other's effects.

### Configuration

| Name        | Type   | Description                                                                                                                                                                                                   |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storageId` | String | The key under which the data is saved. This value should be configured to a reasonably unique value to avoid clashes with other applications at the same origin. Defaults to `trails-state` (with a warning). |

`storageId` applies to **both** services.

```ts
// app.ts
const Element = createCustomElement({
    // ...
    config: {
        properties: {
            "@open-pioneer/local-storage": {
                storageId: "my-app"
            } satisfies StorageProperties
        }
    }
});
```

### Implementation notes

Each service manages its data as a single, hierarchical JSON object.
This JSON object is loaded from and saved to the respective browser storage area using the `storageId` key.

The top level value is always an object; its properties are manipulated when calling `get`, `set` etc. on the service.
Nested values can be arbitrary (JSON-compatible) values.

## License

Apache-2.0 (see `LICENSE` file)
