// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from "vitest";
import { deepEqual, shallowEqual } from "./equals";

describe("shallowEqual", () => {
    it("returns true for identical primitives", () => {
        expect(shallowEqual(1, 1)).toBe(true);
        expect(shallowEqual("a", "a")).toBe(true);
        expect(shallowEqual(true, true)).toBe(true);
        expect(shallowEqual(null, null)).toBe(true);
        expect(shallowEqual(undefined, undefined)).toBe(true);
    });

    it("returns false for different primitives", () => {
        expect(shallowEqual(1, 2)).toBe(false);
        expect(shallowEqual("a", "b")).toBe(false);
        expect(shallowEqual(true, false)).toBe(false);
        expect(shallowEqual(null, undefined)).toBe(false);
        expect(shallowEqual(1, "1")).toBe(false);
    });

    it("treats NaN as equal to NaN", () => {
        expect(shallowEqual(NaN, NaN)).toBe(true);
    });

    it("returns true for identical object references", () => {
        const o = { a: 1 };
        expect(shallowEqual(o, o)).toBe(true);
    });

    it("returns true for objects with same keys and reference-equal values", () => {
        const inner = { x: 1 };
        expect(shallowEqual({ a: 1, b: inner }, { a: 1, b: inner })).toBe(true);
    });

    it("returns false for objects whose nested values differ by reference", () => {
        expect(shallowEqual({ a: { x: 1 } }, { a: { x: 1 } })).toBe(false);
    });

    it("returns false when key sets differ", () => {
        expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
        expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it("returns false when a value with the same key differs", () => {
        expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("returns true for arrays with reference-equal elements", () => {
        const item = { x: 1 };
        expect(shallowEqual([1, 2, item], [1, 2, item])).toBe(true);
    });

    it("returns false for arrays of different length", () => {
        expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("returns false when comparing an array with a plain object", () => {
        expect(shallowEqual([], {})).toBe(false);
    });

    it("returns false when comparing an object with null/undefined", () => {
        expect(shallowEqual({ a: 1 }, null)).toBe(false);
        expect(shallowEqual(null, { a: 1 })).toBe(false);
        expect(shallowEqual({ a: 1 }, undefined)).toBe(false);
    });

    it("ignores inherited properties", () => {
        const proto = { inherited: true };
        const a = Object.create(proto);
        a.own = 1;
        const b = Object.create(proto);
        b.own = 1;
        expect(shallowEqual(a, b)).toBe(true);
    });

    it("compares functions by reference", () => {
        const f = () => 1;
        const g = () => 1;
        expect(shallowEqual(f, g)).toBe(false);
        expect(shallowEqual(f, f)).toBe(true);
    });
});

describe("deepEquals", () => {
    it("returns true for identical primitives", () => {
        expect(deepEqual(1, 1)).toBe(true);
        expect(deepEqual("a", "a")).toBe(true);
        expect(deepEqual(null, null)).toBe(true);
        expect(deepEqual(undefined, undefined)).toBe(true);
    });

    it("returns false for different primitives", () => {
        expect(deepEqual(1, 2)).toBe(false);
        expect(deepEqual("a", "b")).toBe(false);
        expect(deepEqual(null, undefined)).toBe(false);
    });

    it("treats NaN as equal to NaN", () => {
        expect(deepEqual(NaN, NaN)).toBe(true);
    });

    it("returns true for deeply equal plain objects", () => {
        expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    });

    it("returns false when a nested value differs", () => {
        expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it("returns false when key sets differ", () => {
        expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it("returns false for objects with same keys but undefined vs missing", () => {
        expect(deepEqual({ a: undefined }, {})).toBe(false);
    });

    it("returns true for deeply equal arrays", () => {
        expect(deepEqual([1, [2, 3], { a: 4 }], [1, [2, 3], { a: 4 }])).toBe(true);
    });

    it("returns false for arrays of different length", () => {
        expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("returns false when comparing an array with a plain object", () => {
        expect(deepEqual([], {})).toBe(false);
    });

    it("compares non-plain object", () => {
        const d1 = new Date(0);
        const d2 = new Date(0);
        expect(deepEqual(d1, d1)).toBe(true);
        expect(deepEqual(d1, d2)).toBe(true);
    });

    it("compare class instances", () => {
        class Box {
            constructor(public value: number) {}
        }
        const a = new Box(1);
        const b = new Box(1);
        const c = new Box(2);
        expect(deepEqual(a, b)).toBe(true);
        expect(deepEqual(a, a)).toBe(true);
        expect(deepEqual(a, c)).toBe(false);
    });

    it("compares functions by reference", () => {
        const f = () => 1;
        const g = () => 1;
        expect(deepEqual(f, g)).toBe(false);
        expect(deepEqual(f, f)).toBe(true);
    });

    it("recurses into objects nested in arrays", () => {
        expect(deepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
        expect(deepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
    });

    it("recurses into arrays nested in objects", () => {
        expect(deepEqual({ xs: [1, 2] }, { xs: [1, 2] })).toBe(true);
        expect(deepEqual({ xs: [1, 2] }, { xs: [1, 3] })).toBe(false);
    });

    it("returns false for an object compared with a null-prototype copy", () => {
        const a = { x: 1 };
        const b = Object.create(null);
        b.x = 1;
        expect(deepEqual(a, b)).toBe(false);
    });
});
