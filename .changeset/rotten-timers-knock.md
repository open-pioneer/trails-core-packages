---
"@open-pioneer/runtime": major
---

Introduce an advanced option to disable the shadow root.

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
