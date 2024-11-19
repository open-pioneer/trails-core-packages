// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { it, expect } from "vitest";
import { NumberParser } from "./NumberParser";

it("correctly formats number in en-US", function () {
    const parser = new NumberParser("en-US");
    const parsedNumber = parser.parse("12,345.6");
    expect(parsedNumber).toBe(12345.6);
});

it("correctly formats number in de-DE", function () {
    const parser = new NumberParser("de-DE");
    const parsedNumber = parser.parse("12.345,6");
    expect(parsedNumber).toBe(12345.6);
});

it("correctly formats number in fr-FR", function () {
    const parser = new NumberParser("fr-FR");
    const parsedNumber = parser.parse("12 345,6");
    expect(parsedNumber).toBe(12345.6);
});

it("returns NaN for invalid number", function () {
    const parser = new NumberParser("en-US");
    const parsedNumber = parser.parse("abc");
    expect(parsedNumber).toBeNaN();
});

it("returns NaN for empty string", function () {
    const parser = new NumberParser("en-US");
    const parsedNumber = parser.parse("");
    expect(parsedNumber).toBeNaN();
});

it("returns NaN for whitespace in languages that do not use whitespace as a separator", function () {
    const parser = new NumberParser("en-US");
    const parsedNumber = parser.parse("12 345.6");
    expect(parsedNumber).toBeNaN();
});
