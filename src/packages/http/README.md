# @open-pioneer/http

This package provides the `HttpService`, which can be used to request resources over HTTP.

## Usage

To use the HTTP service, reference the interface `http.HttpService` from your service as in the following sample:

```js
// build.config.mjs
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    services: {
        MyService: {
            references: {
                httpService: "http.HttpService"
            }
        }
        // ...
    }
    // ...
});
```

From the implementation class of `MyService`, call `fetch()` on the service:

```js
// MyService.js
export class MyService {
    constructor(serviceOptions) {
        this.httpService = serviceOptions.references.httpService;
    }

    async myMethod() {
        const response = await this.httpService.fetch(/* ... */);
    }
}
```

The signature of the `fetch()` method is compatible to the Browser's global [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) function.
However, the `HttpService`'s method should be preferred to take advantage of future features (such as logging or proxy support).

### Request interceptors

> The request interceptor API is experimental: it may change with a new minor release as a response to feedback.

The `HttpService` supports extension via _request interceptors_.
Request interceptors can modify requests (query parameters, headers, etc.) before they are sent to the server.

To register a request interceptor, implement a service that provides `"http.Interceptor"`:

```js
// build.config.mjs
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    services: {
        ExampleInterceptor: {
            provides: "http.Interceptor"
        }
        // ...
    }
    // ...
});
```

```ts
// ExampleInterceptor.ts
import { Interceptor, BeforeRequestParams } from "@open-pioneer/http";
export class ExampleInterceptor implements Interceptor {
    async beforeRequest?(params: BeforeRequestParams) {
        // Invoked for every request. See API documentation for more details.
    }
}
```

## License

Apache-2.0 (see `LICENSE` file)
