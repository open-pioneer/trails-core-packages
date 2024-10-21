# @open-pioneer/reactivity

## 2.3.0

### Minor Changes

-   2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

## 2.2.0

### Patch Changes

-   39dad46: Switch to a new versioning strategy.
    From now on, packages released by this repository share a common version number.

## 0.1.0

### Minor Changes

-   5d3aafd: Initial release.

    You can use the hook `useReactiveSnapshot` to write React components that make use of the reactivity API of [@conterra/reactivity-core](https://www.npmjs.com/package/@conterra/reactivity-core).
    Quick example:

    ```tsx
    export function YourComponent({ model }) {
        // model is implemented using the reactivity API
        const fullName = useReactiveSnapshot(() => {
            return `${model.firstName} ${model.lastName}`;
        }, [model]);

        // Name is automatically kept up-to-date.
        return <div>Hello {fullName}</div>;
    }
    ```

    The reactivity API is not directly used in any trails packages at this time.
    However, moving forward, most packages will use the reactivity API as _the_ common reactivity system.
