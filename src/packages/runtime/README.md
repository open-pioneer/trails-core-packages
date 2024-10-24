# @open-pioneer/runtime

Implements the runtime environment for Open Pioneer Trails apps.

## Quick start

Import the `createCustomElement` function from this package to create your application as a Web Component:

```js
// my-app/app.js
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { AppUI } from "./AppUI";

const Element = createCustomElement({
    component: AppUI,
    appMetadata
});

customElements.define("my-app", Element);
```

In this example, `Element` is a custom web component class registered as `<my-app>`.
The application renders the `AppUI` (a react component) and automatically contains services, styles etc. its package dependencies.
HTML sites or JavaScript code can now instantiate the application by creating a DOM-Element:

```html
<!-- some-site/index.html -->
<!doctype html>
<html>
    <body>
        <!-- Contains the app once the script has been loaded -->
        <my-app></my-app>
        <script type="module" src="/apps/my-app/app.ts"></script>
    </body>
</html>
```

## Error screen

If a hard error occurs on application start, the `AppUI` cannot be rendered but an error screen is shown instead.
The error screen shows a message to the user that an error occurred on application start.
The error screen is available in english (fallback) and german.

If the application was started in DEV-mode, the error screen shows additional information about the error and the stack trace.

## License

Apache-2.0 (see `LICENSE` file)
