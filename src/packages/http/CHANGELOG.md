# @open-pioneer/http

## 2.4.0

### Patch Changes

-   1b63ebe: Update dependencies
-   Updated dependencies [1b63ebe]
-   Updated dependencies [e3802fb]
-   Updated dependencies [ac39468]
-   Updated dependencies [e3802fb]
    -   @open-pioneer/core@2.4.0
    -   @open-pioneer/runtime@2.4.0

## 2.3.0

### Minor Changes

-   2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

### Patch Changes

-   Updated dependencies [2fbaaa0]
    -   @open-pioneer/runtime@2.3.0
    -   @open-pioneer/core@2.3.0

## 2.2.0

### Patch Changes

-   39dad46: Switch to a new versioning strategy.
    From now on, packages released by this repository share a common version number.
-   Updated dependencies [39dad46]
    -   @open-pioneer/core@2.2.0
    -   @open-pioneer/runtime@2.2.0

## 2.1.9

### Patch Changes

-   5c62522: Update wording and harmonize structure
-   Updated dependencies [5c62522]
-   Updated dependencies [58ce24f]
-   Updated dependencies [50550d3]
-   Updated dependencies [e0b2fae]
-   Updated dependencies [6cc7fcd]
    -   @open-pioneer/core@1.3.0
    -   @open-pioneer/runtime@2.1.7

## 2.1.8

### Patch Changes

-   Updated dependencies [e945264]
    -   @open-pioneer/runtime@2.1.6

## 2.1.7

### Patch Changes

-   Updated dependencies [90d0cce]
-   Updated dependencies [90d0cce]
    -   @open-pioneer/runtime@2.1.5

## 2.1.6

### Patch Changes

-   b3c60f2: Harmonize naming of Open Pioneer Trails in READMEs and package.json files.
-   Updated dependencies [5d3aafd]
-   Updated dependencies [64645aa]
-   Updated dependencies [b3c60f2]
    -   @open-pioneer/core@1.2.3
    -   @open-pioneer/runtime@2.1.4

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
