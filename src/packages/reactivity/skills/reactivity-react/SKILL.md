---
name: reactivity-react
description: How to render state from @conterra/reactivity-core signals in React with @open-pioneer/reactivity (useReactiveSnapshot, useReactiveValue, useComputed, useReactive, DISPATCH_SYNC). Use when writing or reviewing React components that read signals, models or Trails services, or when deciding whether component state belongs in React state or in signals.
---

# @open-pioneer/reactivity

React hooks that subscribe a component to signals from `@conterra/reactivity-core`.
For signals, `computed`, `batch`, dispatch and timing see the `reactivity-core` skill.

Full documentation: `node_modules/@open-pioneer/reactivity/README.md`.
API docs are in the type declarations (`node_modules/@open-pioneer/reactivity/index.d.ts`).

## Where state lives

- State owned by a service or model, or derived from it, lives in signals and reaches components through `useReactiveSnapshot`.
- Local UI state of one component, or of a few plain UI components, may stay in React state or context.
- Reactive values enter a component only through the hooks below; copying them into React state is a bug (see [Common mistakes](#common-mistakes)).

## useReactiveSnapshot

```tsx
import { useReactiveSnapshot } from "@open-pioneer/reactivity";

interface GreetingProps {
    model: Model;
    greeting: string;
}

// `model.firstName` and `model.lastName` are getters backed by signals (see the reactivity-core skill).
function Greeting({ model, greeting }: GreetingProps) {
    const text = useReactiveSnapshot(
        () => `${greeting} ${model.firstName} ${model.lastName}`,
        [model, greeting]
    );
    return <div>{text}</div>;
}

// Services are read the same way (themeService from useService()).
const colorMode = useReactiveSnapshot(() => themeService.colorMode, [themeService]);
```

- The callback is tracked like a `computed`: it re-runs when a signal it read changes, and the component re-renders when the result changes (`Object.is`).
- Keep the callback pure. It may run any number of times, so writes and side effects belong in event handlers or model methods.
- Return an object or array to read several values with one hook, or use multiple hooks.

### Dependencies

The hook tracks reads of reactive data: signal `.value` reads and getters backed by signals.
Everything else the callback reads is non-reactive data in terms of the reactivity API: props, React state, context, results of `useService()`, local variables.
List all non-reactive data in `deps`, including the model or service object whose getters you read.
Never list the reactive values themselves.
The lint rule `react-hooks/exhaustive-deps` checks `deps` once it is configured with `additionalHooks`; see README section `### ESLint configuration`.

## Other hooks

- `useReactiveValue(signal)`: one signal at hand, nothing to compute. Same as `useReactiveSnapshot(() => signal.value, [signal])`.
- `useComputed(compute, deps)`: a `computed` signal created inside a component, for passing to children, models or other hooks. Same `deps` rule.
- `useReactive(initialValue)`: a signal that lives as long as the component, like `useState`. For local state that must feed into a `computed` or a model.
- `DISPATCH_SYNC` as the `options` argument of `useReactiveSnapshot` or `useReactiveValue`: the component re-renders synchronously with the write. For controlled inputs, focus management and layout; the async default fits everything else.

## Common mistakes

- Reading a getter or `.value` in the render body outside a hook: the read is not tracked, so the component shows a stale value.

```tsx
// Wrong
return <div>{model.firstName}</div>;

// Right
const firstName = useReactiveSnapshot(() => model.firstName, [model]);
return <div>{firstName}</div>;
```

- Missing `deps`: the callback keeps reading an old prop, service or model.
- Writing signals or running side effects inside the callback; move them to event handlers, model methods or `useEffect` on the snapshot.
- Mirroring a reactive value into React state. Render the snapshot directly.

```tsx
// Wrong
const [name, setName] = useState(model.firstName);
useEffect(() => setName(model.firstName), [model.firstName]);

// Right
const name = useReactiveSnapshot(() => model.firstName, [model]);
```

- An inline options object such as `{ dispatch: "sync" }` re-subscribes on every render. Pass the constant `DISPATCH_SYNC` or memoize the object.
- `DISPATCH_SYNC` as the default. It causes redundant renders; reserve it for inputs, focus and layout.
