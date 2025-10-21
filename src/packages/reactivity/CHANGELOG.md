# @open-pioneer/reactivity

## 4.2.0

### Minor Changes

- ed3d452: Update @conterra/reactivity-core to 0.8.0. This release is backwards compatible to 0.7.x, but contains a few deprecations.
- 1b95a62: Update chakra-ui to 3.28.0

### Patch Changes

- 81308c0: Update to eslint 9

## 4.1.0

### Patch Changes

- b7a854d: Update dependencies
- adf277b: Update dependencies

## 4.0.0

### Patch Changes

- 434bd04: Bump dependencies.
- 1f4fa84: Update @conterra/reactivity-\* to 0.7.0

## 3.1.0

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

### Patch Changes

- 1b63ebe: Update dependencies

## 2.3.0

### Minor Changes

- 2fbaaa0: Use normal `dependencies` instead of `peerDependencies`. Peer dependencies have some usability issues (and bugs) when used at scale.

## 2.2.0

### Patch Changes

- 39dad46: Switch to a new versioning strategy.
  From now on, packages released by this repository share a common version number.

## 0.1.0

### Minor Changes

- 5d3aafd: Initial release.

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
