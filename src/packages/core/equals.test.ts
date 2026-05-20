// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from "vitest";
import { deepEquals, shallowEquals } from "./equals";

describe("shallowEquals", () => {
    it("returns true for identical primitives", () => {
        expect(shallowEquals(1, 1)).toBe(true);
        expect(shallowEquals("a", "a")).toBe(true);
        expect(shallowEquals(true, true)).toBe(true);
        expect(shallowEquals(null, null)).toBe(true);
        expect(shallowEquals(undefined, undefined)).toBe(true);
    });

    it("returns false for different primitives", () => {
        expect(shallowEquals(1, 2)).toBe(false);
        expect(shallowEquals("a", "b")).toBe(false);
        expect(shallowEquals(true, false)).toBe(false);
        expect(shallowEquals(null, undefined)).toBe(false);
        expect(shallowEquals(1, "1")).toBe(false);
    });

    it("treats NaN as equal to NaN", () => {
        expect(shallowEquals(NaN, NaN)).toBe(true);
    });

    it("returns true for identical object references", () => {
        const o = { a: 1 };
        expect(shallowEquals(o, o)).toBe(true);
    });

    it("returns true for objects with same keys and reference-equal values", () => {
        const inner = { x: 1 };
        expect(shallowEquals({ a: 1, b: inner }, { a: 1, b: inner })).toBe(true);
    });

    it("returns false for objects whose nested values differ by reference", () => {
        expect(shallowEquals({ a: { x: 1 } }, { a: { x: 1 } })).toBe(false);
    });

    it("returns false when key sets differ", () => {
        expect(shallowEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        expect(shallowEquals({ a: 1, b: 2 }, { a: 1 })).toBe(false);
        expect(shallowEquals({ a: 1 }, { b: 1 })).toBe(false);
    });

    it("returns false when a value with the same key differs", () => {
        expect(shallowEquals({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("returns true for arrays with reference-equal elements", () => {
        const item = { x: 1 };
        expect(shallowEquals([1, 2, item], [1, 2, item])).toBe(true);
    });

    it("returns false for arrays of different length", () => {
        expect(shallowEquals([1, 2], [1, 2, 3])).toBe(false);
    });

    it("returns false when comparing an array with a plain object", () => {
        expect(shallowEquals([], {})).toBe(false);
    });

    it("returns false when comparing an object with null/undefined", () => {
        expect(shallowEquals({ a: 1 }, null)).toBe(false);
        expect(shallowEquals(null, { a: 1 })).toBe(false);
        expect(shallowEquals({ a: 1 }, undefined)).toBe(false);
    });

    it("ignores inherited properties", () => {
        const proto = { inherited: true };
        const a = Object.create(proto);
        a.own = 1;
        const b = Object.create(proto);
        b.own = 1;
        expect(shallowEquals(a, b)).toBe(true);
    });

    it("compares functions by reference", () => {
        const f = () => 1;
        const g = () => 1;
        expect(shallowEquals(f, g)).toBe(false);
        expect(shallowEquals(f, f)).toBe(true);
    });
});

describe("deepEquals", () => {
    it("returns true for identical primitives", () => {
        expect(deepEquals(1, 1)).toBe(true);
        expect(deepEquals("a", "a")).toBe(true);
        expect(deepEquals(null, null)).toBe(true);
        expect(deepEquals(undefined, undefined)).toBe(true);
    });

    it("returns false for different primitives", () => {
        expect(deepEquals(1, 2)).toBe(false);
        expect(deepEquals("a", "b")).toBe(false);
        expect(deepEquals(null, undefined)).toBe(false);
    });

    it("treats NaN as equal to NaN", () => {
        expect(deepEquals(NaN, NaN)).toBe(true);
    });

    it("returns true for deeply equal plain objects", () => {
        expect(deepEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    });

    it("returns false when a nested value differs", () => {
        expect(deepEquals({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });

    it("returns false when key sets differ", () => {
        expect(deepEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
        expect(deepEquals({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it("returns false for objects with same keys but undefined vs missing", () => {
        expect(deepEquals({ a: undefined }, {})).toBe(false);
    });

    it("returns true for deeply equal arrays", () => {
        expect(deepEquals([1, [2, 3], { a: 4 }], [1, [2, 3], { a: 4 }])).toBe(true);
    });

    it("returns false for arrays of different length", () => {
        expect(deepEquals([1, 2], [1, 2, 3])).toBe(false);
    });

    it("returns false when comparing an array with a plain object", () => {
        expect(deepEquals([], {})).toBe(false);
    });

    it("compares non-plain object", () => {
        const d1 = new Date(0);
        const d2 = new Date(0);
        expect(deepEquals(d1, d1)).toBe(true);
        expect(deepEquals(d1, d2)).toBe(true);
    });

    it("compare class instances", () => {
        class Box {
            constructor(public value: number) {}
        }
        const a = new Box(1);
        const b = new Box(1);
        const c = new Box(2);
        expect(deepEquals(a, b)).toBe(true);
        expect(deepEquals(a, a)).toBe(true);
        expect(deepEquals(a, c)).toBe(false);
    });

    it("compares functions by reference", () => {
        const f = () => 1;
        const g = () => 1;
        expect(deepEquals(f, g)).toBe(false);
        expect(deepEquals(f, f)).toBe(true);
    });

    it("recurses into objects nested in arrays", () => {
        expect(deepEquals([{ a: 1 }], [{ a: 1 }])).toBe(true);
        expect(deepEquals([{ a: 1 }], [{ a: 2 }])).toBe(false);
    });

    it("recurses into arrays nested in objects", () => {
        expect(deepEquals({ xs: [1, 2] }, { xs: [1, 2] })).toBe(true);
        expect(deepEquals({ xs: [1, 2] }, { xs: [1, 3] })).toBe(false);
    });

    it("returns false for an object compared with a null-prototype copy", () => {
        const a = { x: 1 };
        const b = Object.create(null);
        b.x = 1;
        expect(deepEquals(a, b)).toBe(false);
    });
});
