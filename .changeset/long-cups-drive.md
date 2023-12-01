---
"@open-pioneer/runtime": major
---

**Breaking Change**: change how services integrate into TypeScript (fixes #22).
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
