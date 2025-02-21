// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Reactive, batch, computed, isReactive, reactive } from "@conterra/reactivity-core";
import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useComputed, useReactive, useReactiveSnapshot, useReactiveValue } from "./index";
import { Model } from "./examples/Model";
import { YourComponent } from "./examples/YourComponent";

describe("useReactive", () => {
    it("creates a new signal", () => {
        const hook = renderHook(() => {
            const signal = useReactive();
            return signal;
        });

        const signal = hook.result.current;
        expect(isReactive(signal)).toBe(true);
        expect(signal.value).toBeUndefined();
    });

    it("supports initial values", () => {
        const hook = renderHook(() => {
            const signal = useReactive(123);
            return signal;
        });

        const signal = hook.result.current;
        expect(signal.value).toBe(123);
    });

    it("does not change the signal instance if the initial value changes", () => {
        const hook = renderHook(
            (init: number) => {
                // only the very first value of `init` is used, like in useState()
                const signal = useReactive(init);
                return signal;
            },
            {
                initialProps: 42
            }
        );

        const signal1 = hook.result.current;
        expect(signal1.value).toBe(42);

        hook.rerender(43);
        const signal2 = hook.result.current;
        expect(signal1).toBe(signal2);
        expect(signal2.value).toBe(42);
    });
});

describe("useComputed", () => {
    it("creates a computed signal", () => {
        const hook = renderHook(() => {
            const computed = useComputed(() => 1, []);
            return computed;
        });
        expect(String(hook.result.current)).toMatchInlineSnapshot(`"Reactive[value=1]"`);
    });

    it("evaluates the function body", () => {
        const count = reactive(1);
        let calls = 0;
        const hook = renderHook(() => {
            const computed = useComputed(() => {
                calls += 1;
                return count.value * 2;
            }, []);
            return computed;
        });

        const computed = hook.result.current;
        hook.rerender();
        expect(hook.result.current).toBe(computed); // cached instance
        expect(calls).toBe(0); // never called

        expect(computed.value).toBe(2);
        expect(calls).toBe(1);

        count.value += 1;
        expect(computed.value).toBe(4);
        expect(calls).toBe(2);
    });

    it("re-creates the computed signal if deps change", () => {
        const hook = renderHook(
            (props: { a: number }) => {
                const computed = useComputed(() => props.a, [props.a]);
                return computed;
            },
            {
                initialProps: {
                    a: 1
                }
            }
        );

        const initialComputed = hook.result.current;

        // no change
        hook.rerender({ a: 1 });
        expect(hook.result.current).toBe(initialComputed);

        // new instance
        hook.rerender({ a: 2 });
        expect(hook.result.current).not.toBe(initialComputed);
    });
});

describe("useReactiveValue", () => {
    it("watches signals", async () => {
        const count = reactive(1);

        const hook = renderHook(() => {
            const computed = useComputed(() => count.value * 2, []);
            const value = useReactiveValue(computed);
            return value;
        });
        expect(hook.result.current).toBe(2);

        await act(async () => {
            count.value = 10;
            await waitForUpdate();
        });
        expect(hook.result.current).toBe(20);
    });
});

describe("useReactiveSnapshot", () => {
    it("watches reactive values", async () => {
        const a = reactive(1);
        const b = reactive(2);
        const product = computed(() => a.value * b.value);

        let calls = 0;
        const hook = renderHook(() =>
            useReactiveSnapshot(() => {
                calls += 1;
                return {
                    a: a.value,
                    b: b.value,
                    product: product.value,
                    sum: a.value + b.value
                };
            }, [])
        );

        expect(calls).toBe(1);
        expect(hook.result.current).toMatchInlineSnapshot(`
          {
            "a": 1,
            "b": 2,
            "product": 2,
            "sum": 3,
          }
        `);

        await act(async () => {
            batch(() => {
                a.value = 1000;
                b.value = 3000;
            });
            waitForUpdate();
        });

        expect(calls).toBe(2);
        expect(hook.result.current).toMatchInlineSnapshot(`
          {
            "a": 1000,
            "b": 3000,
            "product": 3000000,
            "sum": 4000,
          }
        `);
    });

    it("updates when react values change", () => {
        const a = reactive(10);
        const b = reactive(20);

        let calls = 0;
        const hook = renderHook(
            (props: { additional: number; reactive: Reactive<number> }) => {
                return useReactiveSnapshot(() => {
                    calls += 1;
                    return {
                        value: props.reactive.value + props.additional
                    };
                }, [props.additional, props.reactive]);
            },
            {
                initialProps: {
                    additional: 1,
                    reactive: a
                }
            }
        );

        expect(calls).toBe(1);
        expect(hook.result.current).toMatchInlineSnapshot(`
          {
            "value": 11,
          }
        `);

        // change plain react value
        hook.rerender({
            additional: 2,
            reactive: a
        });
        expect(calls).toBe(2);
        expect(hook.result.current).toMatchInlineSnapshot(`
          {
            "value": 12,
          }
        `);

        // change to a different reactive value
        hook.rerender({
            additional: 2,
            reactive: b
        });
        expect(calls).toBe(3);
        expect(hook.result.current).toMatchInlineSnapshot(`
          {
            "value": 22,
          }
        `);

        // no change -> no call
        hook.rerender({
            additional: 2,
            reactive: b
        });
        expect(calls).toBe(3);
    });
});

describe("rendering components", () => {
    interface Model {
        currentCount: number;
    }

    class ModelImpl implements Model {
        _currentCount: Reactive<number>;

        constructor(initialValue = 3) {
            this._currentCount = reactive(initialValue);
        }

        get currentCount() {
            return this._currentCount.value;
        }

        set currentCount(newValue: number) {
            this._currentCount.value = newValue;
        }
    }

    function Component(props: { model: Model }) {
        const { model } = props;
        const currentCount = useReactiveSnapshot(() => model.currentCount, [model]);
        return <div data-testid="content">The current count is {currentCount}</div>;
    }

    it("renders a component that uses reactive signals", async () => {
        const model = new ModelImpl();
        render(<Component model={model} />);

        const div = await screen.findByTestId("content");
        expect(div.textContent).toMatch(/current count is 3/);

        await act(async () => {
            model.currentCount = 4;
            await waitForUpdate();
        });
        expect(div.textContent).toMatch(/current count is 4/);
    });

    it("rerenders the component if the model property changes", async () => {
        const model1 = new ModelImpl(1);
        const model2 = new ModelImpl(2);
        const { rerender } = render(<Component model={model1} />);

        const div = await screen.findByTestId("content");
        expect(div.textContent).toMatch(/current count is 1/);

        rerender(<Component model={model2} />);
        expect(div.textContent).toMatch(/current count is 2/);
    });
});

it("renders the example correctly", async () => {
    const model = new Model();
    render(<YourComponent model={model} />);

    const div = await screen.findByText("Hello John Doe");
    await act(async () => {
        model.updateName("Jane", "Doe");
        await waitForUpdate();
    });
    expect(div.textContent).toBe("Hello Jane Doe");
});

// Watch callbacks are executed with a small delay (in a new microtask).
async function waitForUpdate() {
    await new Promise((resolve) => setTimeout(resolve, 1));
}
