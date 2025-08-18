# @open-pioneer/core

This package contains basic utility functions and classes used in Open Pioneer Trails applications.

## Events

The package exports the `EventEmitter` class that supports emitting and subscribing to user defined events.

## Usage

### Errors

The `Error` class extends JavaScript's global error class with a user defined `id` value that
can be used to explicitly identify error conditions.

```js
import { Error } from "@open-pioneer/core";
throw new Error("my-error:identifier", "This is the error message");
```

`Error` also exposes the optional `cause` attribute that allows nesting of error instances.
Note that browser support for that property is still required:

```js
import { Error, getErrorChain } from "@open-pioneer/core";

try {
    someFunctionThatCanThrow();
} catch (e) {
    throw new Error("my-error:higher-level-error-id", "Error text", { cause: e });
}

// getErrorChain gathers the error and all its causes (if any) into an array:
const errors = getErrorChain(error);
```

### Resources

The `Resource` type exported from this package is used by objects with a destructor.
All object needing some cleanup action to be called should use the `destroy` method for consistency and easier handling.

### Logger

The `Logger` class provides a logger for standardized application wide logging.
The log level is configured globally in the file `vite.config.ts`: to change the application's log level,
define the `__LOG_LEVEL__` constant to a custom value.

To create a logger instance, call the `createLogger` method.
It takes a prefix (string) to prepend to each message.
To encode hierarchical names, use `:` as a separator (for example `"some-package:SomeClass"`).

The logger provides log methods for the following log levels with the following order: DEBUG < INFO < WARN < ERROR.

For example (as class attribute):

```ts
import { createLogger, Logger } from "@open-pioneer/core";

export class LoggerTestExample {
    private logger: Logger;
    constructor() {
        this.logger = createLogger("example-package:LoggerTestExample");
    }

    testMethod() {
        this.logger.warn("example message", { testLog: 123, text: "this is a text" });
    }
}
```

Or as a shared logger at module scope:

```ts
import { createLogger } from "@open-pioneer/core";
const LOG = createLogger("example-package");
```

### Deprecations

The `deprecated` function can be used to print warnings when a deprecated entity is used.
Deprecations are printed (once) during development, and not at all in production.
You can disable deprecations via the global configuration in `vite.config.ts`: set `__PRINT_DEPRECATIONS__` to `false` to hide deprecation messages even during development.

To emit a deprecation warning, create a helper function through the `deprecated` function.
Then, when the deprecated functionality is being used, simply call that helper function:

```ts
const printDeprecation = deprecated({
    name: "someFunctionName",
    packageName: "some-package",
    since: "v1.2.3",
    alternative: "use xyz instead"
});

// Later, when the deprecated function is actually being used:
function someFunctionName() {
    printDeprecation(); // prints warning on first call
    // ...
}
```

## License

Apache-2.0 (see `LICENSE` file)
