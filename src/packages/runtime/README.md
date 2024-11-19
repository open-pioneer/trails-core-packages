# @open-pioneer/runtime

Implements the runtime environment for Open Pioneer Trails apps.
Additionally, the package provides some services that provide useful functionalities for app development.

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
The application renders the `AppUI` (a React component) and automatically contains services, styles etc. its package dependencies.
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

## Provided services

The package contains services that provide different functionalities useful for app development.
For details, see the API description of the respective service.

### ApplicationContext

The ApplicationContext provides access to global application values. E.g. the web component's host element and the current locale.

### NumberParserService

The NumberParserService provides a method to parse a string to a number according to the current locale.

## License

Apache-2.0 (see `LICENSE` file)
