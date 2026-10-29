# @open-pioneer/reactivity

This package provides hooks and helpers to work with the reactivity API provided by [@conterra/reactivity-core](https://www.npmjs.com/package/@conterra/reactivity-core).

> NOTE:
> This package and `@conterra/reactivity-core` are still actively being worked on.
> There may be breaking changes based on user feedback; stability can not yet be guaranteed.

## Usage

### Rendering reactive values

The hook `useReactiveSnapshot(callback, deps)` is integrated with the reactivity API of `@conterra/reactivity-core`.
The hook will continuously invoke the provided callback and return the current result.
For this mechanism to work, the values used inside the callback should be based on the reactivity API (or be declared as `deps`).

Example:

```tsx
// YourComponent.tsx
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { Model } from "./Model";

export interface YourComponentProps {
    // Some model class or interface based on the reactivity API.
    // In this case, the model has the properties `firstName` and `lastName`, both are (reactive) strings.
    model: Model;
}

export function YourComponent({ model }: YourComponentProps) {
    const fullName = useReactiveSnapshot(() => {
        // You can compute arbitrary values based on your model, even objects or array.
        // This callback is called whenever any dependency changed, this case if firstName or
        // lastName are updated.
        // Keep in mind that this callback should not have any side effects, because it may run any number of times.
        return `${model.firstName} ${model.lastName}`;
    }, [model]);

    // Name is automatically kept up-to-date.
    return <div>Hello {fullName}</div>;
}
```

- `callback` is a function that accesses reactive values which are based on signals (see example below) and returns some computed _result_.
  In the example above, we used the values of `firstName` and `lastName`.
  The access to those values was tracked by `useReactiveSnapshot`; updates will result in the React component rendering with the updated `fullName`.
- `deps` are an array of React dependencies (such as props or local variables), very similar to `useEffect` or `useMemo`.
  The hook cannot detect changes of values that are _not_ based on the reactivity API (such as react props), so they need to be listed here.
  In this case we had to specify the `model` itself (it may change as well!) but not its properties.

To complete the example from above, here is the full source of a compatible `Model` implementation:

```ts
// Model.ts
import { reactive } from "@conterra/reactivity-core";

export class Model {
    // Private storage. Signals are not exposed in this example.
    #firstName = reactive("John");
    #lastName = reactive("Doe");

    // Public getters to access the current values, with a convenient API.
    get firstName(): string {
        return this.#firstName.value;
    }

    get lastName(): string {
        return this.#lastName.value;
    }

    // Update the name values.
    // Any UI connected to the model via useReactiveSnapshot() will automatically update.
    updateName(newFirstName: string, newLastName: string): void {
        this.#firstName.value = newFirstName;
        this.#lastName.value = newLastName;
    }
}
```

#### Rendering a single reactive value

If you have a single signal at hand, there is no need to use the more complex `useReactiveSnapshot` hook.
You can use the more primitive `useReactiveValue` hook instead:

```jsx
import { useReactiveValue } from "@open-pioneer/reactivity";

function YourComponent({ signal }) {
    const value = useReactiveValue(signal); // Subscribes to `signal.value` and re-renders on changes.
    return <div>{value}</div>;
}
```

More details are available in this package's API documentation and the [README of @conterra/reactivity-core](https://www.npmjs.com/package/@conterra/reactivity-core).

### Signals inside components

`useReactive(initialValue)` creates a signal that lives as long as the component, similar to `useState`.
The initial value is only used on the first render; later renders return the same signal instance.
Use it for local state that must feed into a `computed` or a model, for example a filter text that a model reads.

`useComputed(compute, deps)` creates a `computed` signal inside a component.
The signal is recreated when `deps` change, with the same rules for `deps` as in `useReactiveSnapshot`.
Use it when a child component, a model or another hook needs a signal instead of a plain value.

```tsx
import {
    DISPATCH_SYNC,
    useComputed,
    useReactive,
    useReactiveValue
} from "@open-pioneer/reactivity";

interface SearchProps {
    model: Model;
}

function Search({ model }: SearchProps) {
    const filter = useReactive("");

    // Tracks `filter` and `model.items` (a reactive getter); recreated when `model` changes.
    const matches = useComputed(
        () => model.items.filter((item) => item.name.includes(filter.value)),
        [model]
    );

    const filterText = useReactiveValue(filter, DISPATCH_SYNC);
    const count = useReactiveValue(matches).length;
    return (
        <>
            <input value={filterText} onChange={(e) => (filter.value = e.target.value)} />
            <ResultList items={matches} />
            <div>{count} matches</div>
        </>
    );
}
```

### Sync dispatch

By default, a component re-renders in a later macro task after a signal changed (`dispatch: "async"`), so several synchronous writes result in one render.
`useReactiveSnapshot` and `useReactiveValue` accept an `options` argument of type `ReactiveHookOptions` to change this.
Pass the constant `DISPATCH_SYNC` to re-render immediately after the signals were updated.

This is needed for controlled input fields, focus management and layout work, where React must see the new value in the same tick (see [issue #125](https://github.com/open-pioneer/trails-core-packages/issues/125)).
The `options` object should be constant or memoized, because a new object would re-subscribe on every render.

```tsx
import { DISPATCH_SYNC, useReactiveSnapshot } from "@open-pioneer/reactivity";

const text = useReactiveSnapshot(() => model.text, [model], DISPATCH_SYNC);
return <input value={text} onChange={(e) => model.setText(e.target.value)} />;
```

### ESLint configuration

You can use React's `exhaustive-deps` linting rule to check the dependencies of `useReactiveSnapshot` and `useComputed` (see [Documentation](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#advanced-configuration)).
This will apply the same rules used by `useEffect` etc. to the configured hooks.

Example:

```jsonc
// .eslintrc
{
    // ...
    "rules": {
        // ...
        "react-hooks/exhaustive-deps": [
            "warn",
            {
                "additionalHooks": "(useReactiveSnapshot|useComputed)"
            }
        ]
    }
}
```

## Agent skill

This package ships an agent skill (`skills/reactivity-react/SKILL.md`) that teaches AI coding agents how to use these hooks.
It builds on the `reactivity-core` skill shipped by `@conterra/reactivity-core`, so install both.

With pnpm >= 12.11, the skill is linked into your agent's skill directory automatically once approved (via `pnpm approve` or in `pnpm-workspace.yaml`).
See the [pnpm documentation](https://pnpm.io/agent-skills) for details.

```yaml
# pnpm-workspace.yaml
permissions:
    "@conterra/reactivity-core":
        skills: true
    "@open-pioneer/reactivity":
        skills: true
```

Otherwise, copy or symlink `node_modules/@open-pioneer/reactivity/skills/reactivity-react` into your agent's skill directory (e.g. `.agents/skills/` or `.claude/skills/`).

## License

Apache-2.0 (see `LICENSE` file)
