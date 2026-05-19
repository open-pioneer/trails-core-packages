// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { classNames } from "./classNames";

it("joins multiple strings", () => {
    expect(classNames("foo", "bar")).toBe("foo bar");
});

it("combines a string with an object", () => {
    expect(classNames("foo", { bar: true })).toBe("foo bar");
});

it("includes object keys with truthy values", () => {
    expect(classNames({ "foo-bar": true })).toBe("foo-bar");
});

it("omits object keys with falsy values", () => {
    expect(classNames({ "foo-bar": false })).toBe("");
});

it("merges multiple objects", () => {
    expect(classNames({ foo: true }, { bar: true })).toBe("foo bar");
    expect(classNames({ foo: true, bar: true })).toBe("foo bar");
});

it("handles mixed argument types", () => {
    expect(classNames("foo", { bar: true, duck: false }, "baz", { quux: true })).toBe(
        "foo bar baz quux"
    );
});

it("ignores falsy values but keeps truthy numbers", () => {
    expect(classNames(null, false, "bar", undefined, 0, 1, { baz: null }, "")).toBe("bar 1");
});

it("flattens nested arrays", () => {
    const arr = ["b", { c: true, d: false }];
    expect(classNames("a", arr)).toBe("a b c");
});

it("returns empty string when no input produces a class", () => {
    expect(classNames()).toBe("");
    expect(classNames(null, undefined, false, "", 0)).toBe("");
});

it("ignores inherited object properties", () => {
    const proto = { inherited: true };
    const obj = Object.create(proto);
    obj.own = true;
    expect(classNames(obj)).toBe("own");
});
