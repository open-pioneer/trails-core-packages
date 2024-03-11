# @open-pioneer/http

## 2.1.5

### Patch Changes

-   5ff8f30: Update package.json metadata.
-   Updated dependencies [5ff8f30]
    -   @open-pioneer/runtime@2.1.3
    -   @open-pioneer/core@1.2.2

## 2.1.4

### Patch Changes

-   @open-pioneer/runtime@2.1.2

## 2.1.3

### Patch Changes

-   Updated dependencies [f749d96]
    -   @open-pioneer/runtime@2.1.1

## 2.1.2

### Patch Changes

-   Updated dependencies [80cd62d]
    -   @open-pioneer/runtime@2.1.0

## 2.1.1

### Patch Changes

-   11b1428: Export `rethrowAbortError` from core package and use it correctly in `HttpService`.
-   Updated dependencies [11b1428]
    -   @open-pioneer/core@1.2.1
    -   @open-pioneer/runtime@2.0.2

## 2.1.0

### Minor Changes

-   a18d227: New **experimental** feature: request interceptors.
    Request interceptors can be registered with the `HttpService` to modify requests before they are sent to a server.
    Request interceptors are called automatically by the `HttpService` when they are present as part of the normal request processing.

    Example use case: adding an access token (query parameter or header) to requests for a certain resource.

    Note that the request interceptor API is experimental: it may change with a new minor release as a response to feedback.

### Patch Changes

-   Updated dependencies [a18d227]
    -   @open-pioneer/core@1.2.0
    -   @open-pioneer/runtime@2.0.1

## 2.0.0

### Major Changes

-   6f954e3: Compatibility with @open-pioneer/runtime@^2

### Patch Changes

-   Updated dependencies [f5c0e31]
-   Updated dependencies [ce9e060]
-   Updated dependencies [6f954e3]
    -   @open-pioneer/runtime@2.0.0

## 1.0.3

### Patch Changes

-   Updated dependencies [6632892]
    -   @open-pioneer/runtime@1.1.0

## 1.0.2

### Patch Changes

-   @open-pioneer/runtime@1.0.2

## 1.0.1

### Patch Changes

-   @open-pioneer/runtime@1.0.1

## 1.0.0

### Major Changes

-   22ff68a: Initial release

### Patch Changes

-   Updated dependencies [22ff68a]
    -   @open-pioneer/runtime@1.0.0

## 0.1.1

### Patch Changes

-   9eac5c9: Use peer dependencies for (most) dependencies
-   Updated dependencies [9eac5c9]
    -   @open-pioneer/runtime@0.1.5

## 0.1.0

### Minor Changes

-   234b3be: Create package

### Patch Changes

-   Updated dependencies [234b3be]
-   Updated dependencies [49ba4e1]
    -   @open-pioneer/runtime@0.1.4
