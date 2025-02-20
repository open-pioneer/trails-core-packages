// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ReadonlyReactive, Reactive, computed, reactive, watch } from "@conterra/reactivity-core";
import {
    DependencyList,
    useCallback,
    useDebugValue,
    useMemo,
    useRef,
    useSyncExternalStore
} from "react";

/**
 * Creates a new signal with the initial value `undefined`.
 *
 * The initial value will only be applied on the very first call to this hook.
 * The same signal instance will be returned when this hook is called on the next render.
 * This is very similar (in concept) to React's builtin `useState` hook.
 *
 * @example
 *
 * ```jsx
 * function YourComponent() {
 *     const mySignal = useReactive();
 *     const someEventHandler = () => {
 *         // Update the value after some event
 *         mySignal.value = "new value";
 *     };
 *
 *     // Always returns the current value, re-renders if necessary.
 *     const currentValue = useReactiveValue(mySignal);
 * }
 * ```
 */
export function useReactive<T>(): Reactive<T | undefined>;

/**
 * Creates a new signal with the given initial value.
 *
 * @see {@link useReactive()}.
 */
export function useReactive<T>(initialValue: T): Reactive<T>;

export function useReactive<T>(initialValue?: T): Reactive<T | undefined> {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => reactive(initialValue), []);
}

/**
 * Creates a new computed signal that evaluates the given `compute` function.
 *
 * The hook returns the same signal for as long as `deps` remains the same.
 * When `deps` change, a new signal will be created.
 *
 * @example
 *
 * Defining a simple computed value in your react component:
 *
 * ```jsx
 * function MyComponent(props) {
 *     // Creates a computed value based on the given function.
 *     // The computed value will be re-created whenever one of the listed dependencies changes.
 *     // While the computed value can track all its _reactive_ dependencies automatically (`.value` reads etc.)
 *     // the reactive value itself used here might change (different props) - this cannot be detected automatically.
 *     const computed = useComputed(() => props.someReactive.value * 2, [props.someReactive]);
 *
 *     // Watches on `computed` and returns its current value.
 *     const currentValue = useReactiveValue(computed);
 * }
 * ```
 *
 * > If the body of your compute function depends on non-reactive values (such as react props or state),
 * > list those values in the `deps` array.
 *
 * @see {@link useReactiveValue()}
 * @see {@link useReactiveSnapshot()}
 */
export function useComputed<T>(compute: () => T, deps: DependencyList): ReadonlyReactive<T> {
    const computeRef = useRef(compute);
    computeRef.current = compute;

    const computedDeps = useComputedDeps(deps);
    return useMemo(() => {
        void computedDeps; // not really used, but computed must be recreated when this value changes
        return computed(() => computeRef.current());
    }, [computedDeps]);
}

/**
 * Watches the given reactive object and returns its current value.
 *
 * > NOTE: The return value of this hook should be considered read-only.
 *
 * @see {@link useComputed()}
 */
export function useReactiveValue<T>(reactive: ReadonlyReactive<T>): T {
    const getSnapshot = useCallback(() => {
        return reactive.peek();
    }, [reactive]);
    const subscribe = useCallback(
        (cb: () => void) => {
            const handle = watch(() => [reactive.value], cb);
            return () => handle.destroy();
        },
        [reactive]
    );
    const value = useSyncExternalStore(subscribe, getSnapshot);
    useDebugValue(value);
    return value;
}

/**
 * Evaluates the `compute` function and returns its result.
 *
 * The body of the compute function is tracked: it
 * will be re-evaluated whenever its reactive dependencies change.
 * The outer react component will re-render whenever `compute` returns a new value.
 *
 * > NOTE: The return value of this hook should be considered read-only.
 *
 * @example
 *
 * Simple Example:
 *
 * ```jsx
 * // A reactive signal from anywhere (global data, props, ...).
 * const name = reactive("User");
 *
 * function YourComponent() {
 *     const nameSnapshot = useReactiveSnapshot(() => name.value);
 *     // snapshot is automatically up to date
 * }
 * ```
 *
 * @example
 *
 * Multiple values, with props:
 *
 * ```jsx
 * function YourComponent({firstName, lastName}) {
 *     // You can use complex expressions in your compute function,
 *     // just like in a computed signal.
 *     // React-dependencies used in the callback must be listed in the second argument,
 *     // just like when using `useMemo()` or `useEffect`.
 *     const snapshot = useReactiveSnapshot(() => {
 *         return {
 *             firstName: firstName.value,
 *             lastName: lastName.value,
 *             fullName: `${firstName.value} ${lastName.value}`
 *         };
 *     }, [firstName, lastName]);
 *     // snapshot.firstName, snapshot.lastName, snapshot.fullName are available and up to date
 * }
 * ```
 *
 * @see
 * This hook is based on {@link useComputed()} and {@link useReactiveValue()}.
 */
export function useReactiveSnapshot<T>(compute: () => T, deps: DependencyList): T {
    // We create an internal computed value that executes the compute function;
    // this way the implementation of `compute` is automatically tracked.
    // getSnapshot and subscribe simply watch the current value of that computed value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const computedSnapshot = useComputed(compute, deps);
    const snapshot = useReactiveValue(computedSnapshot);
    useDebugValue(snapshot);
    return snapshot;
}

function useComputedDeps(deps: DependencyList): DependencyList {
    const computedDeps = useRef<DependencyList>();
    if (computedDeps.current == null || !shallowEqual(computedDeps.current, deps)) {
        computedDeps.current = deps ?? [];
    }
    return computedDeps.current;
}

function shallowEqual(a: DependencyList, b: DependencyList): boolean {
    if (a === b) {
        return true;
    }
    return a.length === (b?.length ?? 0) && a.every((v, i) => v === b![i]);
}
