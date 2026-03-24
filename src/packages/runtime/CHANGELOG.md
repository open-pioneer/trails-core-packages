# @open-pioneer/runtime

## 4.4.0

### Minor Changes

- b28d6bc: Update to chakra 3.31.0
- 1cc3415: Update dependency formatjs to v4 (package migrated to ESM).
- 1872a6d: Expose `overrides` in `resolveConfig()` hook when the application restarts.

### Patch Changes

- f9aaf46: Bump various dependencies
- 554d58e: Use `workspace:*` instead of `workspace:^` for local package references as default. This ensures that trails packages from this repository are always referenced with their exact version to avoid potential issues with version mismatches. If a project specifically wants to use other versions for some trails packages, a pnpm override can be used to force other versions.
- 84068f2: Hide emotion warnings for certain css selectors (see [Issue](https://github.com/open-pioneer/trails-core-packages/issues/169)).

## 4.3.0

### Minor Changes

- eb54023: Update chakra to 3.29.0

## 4.2.0

### Minor Changes

- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- 81308c0: Update to eslint 9

## 4.1.0

### Patch Changes

- b7a854d: Update dependencies
- 3881d08: - Update Chakra UI from 3.22.0 to 3.24.2
    - Update to latest Chakra snippets
- adf277b: Update dependencies

## 4.0.0

### Major Changes

- 9f074d8: Update to Chakra 3.x
- 53c92ba: Introduce an advanced option to disable the shadow root.

    By default, trails applications use a shadow root to avoid conflicts (e.g. styles) with other parts of the site where the application may be embedded.

    Applications that use the entire browser viewport may not need this feature, since there may be no "other" parts that may conflict with the app. In this case, you can disable the shadow root by setting this property to `false`.
    - New option `advanced.enableShadowRoot`:

        ```ts
        import { createCustomElement } from "@open-pioneer/runtime";
        import * as appMetadata from "open-pioneer:app";
        import { AppUI } from "./AppUI";

        const element = createCustomElement({
            component: AppUI,
            appMetadata,
            advanced: {
                enableShadowRoot: false
            }
        });

        customElements.define("no-shadowroot-sample", element);
        ```

    - **Breaking:** As a consequence, the `ApplicationContext`'s `getShadowRoot()` method will now return `undefined` if the shadow root is disabled (previous: always a `ShadowRoot`):

        ```ts
        const ctx: ApplicationContext = ...; // injected
        const shadowRoot = ctx.getShadowRoot(); // ShadowRoot | undefined
        ```

    - New method on the `ApplicationContext` that returns _either_ the `ShadowRoot` _or_ the `Document` (if the shadow root is disabled):

        ```ts
        const ctx: ApplicationContext = ...; // injected
        const root = ctx.getRoot(); // Document | ShadowRoot
        root.getElementById("...") // always works
        ```

- 9f074d8: **Breaking:** Rename `theme` option of `createCustomElement()` to `chakraSystemConfig`.

### Patch Changes

- 434bd04: Bump dependencies.

## 3.1.0

### Minor Changes

- 248dab0: Add support for rich text formatting using the `intl` object.
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

    The TypeScript signature for the `intl.formatMessage()` function has been made a little bit stricter compared with FormatJS: only primitive values are allowed for the `values` argument (this should not affect users in practice).

### Patch Changes

- 1c1ede8: Bump dependencies.

## 3.0.0

### Major Changes

- 9477e54: Update dependencies
    - React 19
    - Vite 6
    - FormatJS 3
    - Open Pioneer Build Tools
    - ...

    For more details, see https://github.com/open-pioneer/trails-core-packages/pull/81

## 2.4.0

### Minor Changes

- e3802fb: Introduce `NumberParserService` for parsing strings to numbers in the application's current locale.
- ac39468: Introducing an error screen that is shown in case of hard errors on app start.

### Patch Changes

- 1b63ebe: Update dependencies

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.

## 2.1.7

### Patch Changes

- 58ce24f: Export `DECLARE_SERVICE_INTERFACE` as a value instead of a type only.
  It was previously necessary to import this symbol via `import type` to avoid errors during development.
  The `type` keyword can now be omitted.
- e0b2fae: Update dependencies
- 6cc7fcd: Allow synchronous `getApiMethods()` when implementing an `ApiExtension`.

## 2.1.6

### Patch Changes

- e945264: Improve error message when metadata is missing (#55)
    - @open-pioneer/runtime-react-support@1.0.2

## 2.1.5

### Patch Changes

- 90d0cce: The `resolveConfig` callback of an app's configuration can now inspect the application's `hostElement`.
- 90d0cce: Add a builtin method on the `ApplicationContext` to change the application's locale.
  Note that with the current implementation, the application will simply restart with the new locale.
  The application's state will be lost.

    Example:

    ```ts
    import { ApplicationContext } from "@open-pioneer/runtime";

    const appCtx: ApplicationContext = ...; // injected
    appCtx.setLocale("en-US");
    ```

    - @open-pioneer/runtime-react-support@1.0.2

## 2.1.4

### Patch Changes

- 64645aa: Update to react 18.3
- b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.

## 2.1.3

### Patch Changes

- 5ff8f30: Update package.json metadata.

## 2.1.2

## 2.1.1

### Patch Changes

- f749d96: Add a hint that `DECLARE_SERVICE_INTERFACE` should be imported via `import type`.
    - @open-pioneer/runtime-react-support@1.0.0

## 2.1.0

### Minor Changes

- 80cd62d: Improve TypeScript integration for service classes.

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

- @open-pioneer/runtime-react-support@1.0.0

## 2.0.2

## 2.0.1

## 2.0.0

### Major Changes

- ce9e060: Remove support for closed shadow roots.
  Shadow roots used by Open Pioneer Trails applications are now always `"open"`.
  See #19.
- 6f954e3: **Breaking Change**: change how services integrate into TypeScript (fixes #22).
  The old TypeScript integration had unexpected edge cases, see the linked issue.

    NOTE: The changes below have no impact on runtime behavior, but they may trigger TypeScript errors in your code.
    - To register a service's type with TypeScript, one previously used a block such as this:

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

    - To use a service from React code (i.e. `useService` and `useServices`), you must now use the explicit service type in the hook's generic parameter list. Otherwise the hook will simply return `unknown`:

        ```diff
        + import { HttpService } from "@open-pioneer/http";
        - const httpService = useService("http.HttpService");
        + const httpService = useService<HttpService>("http.HttpService");
        ```

        This change was necessary to fix an issue where the global registration of the service interface (and its association with the string constant) was not available.

        The system will still check that the provided string matches the string constant used in the service's declaration (`DeclaredService<...>`), so type safety is preserved.

    - The types `InterfaceName` and `ServiceType<I>` have been removed. Use explicit service interfaces instead.
    - The interfaces `ServiceRegistry` and `PropertiesRegistry` have been removed as global registration is no longer possible.
    - The type `RawApplicationProperties` has been removed. Use `ApplicationProperties` instead.

### Patch Changes

- f5c0e31: Bump @formatjs/intl version

## 1.1.0

### Minor Changes

- 6632892: Implement support for custom chakra themes via the `theme` parameter in `createCustomElement()`.
  `theme` from `@open-pioneer/base-theme` is used as default when no other theme is configured.

## 1.0.2

## 1.0.1

## 1.0.0

### Major Changes

- 22ff68a: Initial release

## 0.1.5

### Patch Changes

- 9eac5c9: Use peer dependencies for (most) dependencies

## 0.1.4

### Patch Changes

- 234b3be: Fix registrations in ServiceRegistry
- 49ba4e1: Use build-package CLI to build.

## 0.1.3

### Patch Changes

- e752d49: Use new runtime-react-support package

## 0.1.2

### Patch Changes

- a40f12d: Update build-package tool. TypeScript declaration files should now be available.

## 0.1.1

### Patch Changes

- e1c7295: Compiled with build-package 0.5.2

## 0.1.0

### Minor Changes

- 77f7d5c: Initial test release
