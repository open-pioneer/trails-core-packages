---
"@open-pioneer/http": minor
---

New feature: request interceptors.
Request interceptors can be registered with the `HttpService` to modify requests before they are sent to a server.
Request interceptors are called automatically by the `HttpService` when they are present as part of the normal request processing.

Example use case: adding an access token (query parameter or header) to requests for a certain resource.
