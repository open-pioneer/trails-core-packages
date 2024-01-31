---
"@open-pioneer/runtime": minor
---

Improve TypeScript integration for service classes.

Add a way for a service class to specify its interface name directly.
Usually services used across package boundaries split their public interface and their implementation such as this:

```ts
// Exported from package
interface MyService extends DeclaredService<"my-package.SomeInterface"> {
    method(): void;
}

// In an implementation file, usually private.
class MyServiceImpl implements MyService {
    method(): void {
        // ...
    }
}
```

Until now, there was no way for a service class to declare its interface directly.
This could be convenient within a package, or with a group of tightly coupled packages:

```ts
// Error: Type 'MyServiceImpl' has no properties in common with type 'DeclaredService<"my-package.InterfaceName">'.
class MyServiceImpl implements DeclaredService<"my-package.InterfaceName"> {
    method() {}
}
```

From now on, you can write this instead:

```ts
class MyServiceImpl {
    // Tells TypeScript which interface name must be used.
    // See documentation of `DECLARE_SERVICE_INTERFACE` for more details.
    declare [DECLARE_SERVICE_INTERFACE]: "my-package.InterfaceName";

    method(): void {
        // ...
    }
}
```
