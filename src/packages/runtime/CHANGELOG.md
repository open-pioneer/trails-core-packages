# @open-pioneer/runtime

## 2.1.1

### Patch Changes

-   f749d96: Add a hint that `DECLARE_SERVICE_INTERFACE` should be imported via `import type`.
    -   @open-pioneer/runtime-react-support@1.0.0

## 2.1.0

### Minor Changes

-   80cd62d: Improve TypeScript integration for service classes.

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

### Patch Changes

-   @open-pioneer/runtime-react-support@1.0.0

## 2.0.2

### Patch Changes

-   Updated dependencies [11b1428]
    -   @open-pioneer/core@1.2.1
    -   @open-pioneer/runtime-react-support@1.0.0

## 2.0.1

### Patch Changes

-   Updated dependencies [a18d227]
    -   @open-pioneer/core@1.2.0
    -   @open-pioneer/runtime-react-support@1.0.0

## 2.0.0

### Major Changes

-   ce9e060: Remove support for closed shadow roots.
    Shadow roots used by trails applications are now always `"open"`.
    See #19.
-   6f954e3: **Breaking Change**: change how services integrate into TypeScript (fixes #22).
    The old TypeScript integration had unexpected edge cases, see the linked issue.

    NOTE: The changes below have no impact on runtime behavior, but they may trigger TypeScript errors in your code.

    -   To register a service's type with TypeScript, one previously used a block such as this:

        ```ts
        // OLD! Can be removed
        import "@open-pioneer/runtime";
        declare module "@open-pioneer/runtime" {
            interface ServiceRegistry {
                "http.HttpService": HttpService;
            }
        }
        ```

        The new method requires the developer to change the service's declaration.
        Simply add `extends DeclaredService<"SERVICE_ID">` to your service interface, where `SERVICE_ID` should match the service's interface name (`"provides"` in `build.config.mjs`).

        ```diff
        + import { DeclaredService } from "@open-pioneer/runtime";

        - export interface HttpService {
        + export interface HttpService extends DeclaredService<"http.HttpService"> {

        - import "@open-pioneer/runtime";
        - declare module "@open-pioneer/runtime" {
        -     interface ServiceRegistry {
        -         "http.HttpService": HttpService;
        -     }
        - }
        ```

    -   To use a service from React code (i.e. `useService` and `useServices`), you must now use the explicit service type in the hook's generic parameter list. Otherwise the hook will simply return `unknown`:

        ```diff
        + import { HttpService } from "@open-pioneer/http";
        - const httpService = useService("http.HttpService");
        + const httpService = useService<HttpService>("http.HttpService");
        ```

        This change was necessary to fix an issue where the global registration of the service interface (and its association with the string constant) was not available.

        The system will still check that the provided string matches the string constant used in the service's declaration (`DeclaredService<...>`), so type safety is preserved.

    -   The types `InterfaceName` and `ServiceType<I>` have been removed. Use explicit service interfaces instead.
    -   The interfaces `ServiceRegistry` and `PropertiesRegistry` have been removed as global registration is no longer possible.
    -   The type `RawApplicationProperties` has been removed. Use `ApplicationProperties` instead.

### Patch Changes

-   f5c0e31: Bump @formatjs/intl version
-   Updated dependencies [f5c0e31]
-   Updated dependencies [6f954e3]
    -   @open-pioneer/chakra-integration@1.1.1
    -   @open-pioneer/base-theme@0.2.0
    -   @open-pioneer/runtime-react-support@1.0.0

## 1.1.0

### Minor Changes

-   6632892: Implement support for custom chakra themes via the `theme` parameter in `createCustomElement()`.
    `theme` from `@open-pioneer/base-theme` is used as default when no other theme is configured.

### Patch Changes

-   Updated dependencies [6632892]
-   Updated dependencies [6632892]
    -   @open-pioneer/base-theme@0.1.0
    -   @open-pioneer/chakra-integration@1.1.0
    -   @open-pioneer/runtime-react-support@1.0.0

## 1.0.2

### Patch Changes

-   Updated dependencies [69c0fcd]
    -   @open-pioneer/core@1.1.0
    -   @open-pioneer/runtime-react-support@1.0.0

## 1.0.1

### Patch Changes

-   Updated dependencies [88fd710]
    -   @open-pioneer/core@1.0.1
    -   @open-pioneer/runtime-react-support@1.0.0

## 1.0.0

### Major Changes

-   22ff68a: Initial release

### Patch Changes

-   Updated dependencies [22ff68a]
    -   @open-pioneer/chakra-integration@1.0.0
    -   @open-pioneer/core@1.0.0
    -   @open-pioneer/runtime-react-support@1.0.0

## 0.1.5

### Patch Changes

-   9eac5c9: Use peer dependencies for (most) dependencies
-   Updated dependencies [9eac5c9]
    -   @open-pioneer/runtime-react-support@0.1.2
    -   @open-pioneer/chakra-integration@0.1.4
    -   @open-pioneer/core@0.1.4

## 0.1.4

### Patch Changes

-   234b3be: Fix registrations in ServiceRegistry
-   49ba4e1: Use build-package CLI to build.
-   Updated dependencies [49ba4e1]
    -   @open-pioneer/chakra-integration@0.1.3
    -   @open-pioneer/core@0.1.3
    -   @open-pioneer/runtime-react-support@0.1.1

## 0.1.3

### Patch Changes

-   e752d49: Use new runtime-react-support package
-   Updated dependencies [e752d49]
    -   @open-pioneer/runtime-react-support@0.1.0

## 0.1.2

### Patch Changes

-   a40f12d: Update build-package tool. TypeScript declaration files should now be available.
-   Updated dependencies [a40f12d]
    -   @open-pioneer/chakra-integration@0.1.2
    -   @open-pioneer/core@0.1.2

## 0.1.1

### Patch Changes

-   e1c7295: Compiled with build-package 0.5.2
-   Updated dependencies [e1c7295]
    -   @open-pioneer/chakra-integration@0.1.1
    -   @open-pioneer/core@0.1.1

## 0.1.0

### Minor Changes

-   77f7d5c: Initial test release

### Patch Changes

-   Updated dependencies [77f7d5c]
    -   @open-pioneer/chakra-integration@0.1.0
    -   @open-pioneer/core@0.1.0
