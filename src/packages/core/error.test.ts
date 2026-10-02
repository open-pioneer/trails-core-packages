// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { it, expect, describe } from "vitest";
import { Error, getErrorChain, isAbortError, throwAbortError } from "./error";

describe("Error", function () {
    it("builds the message from id and text", function () {
        const error = new Error("test:some-id", "some text");
        expect(error.id).toBe("test:some-id");
        expect(error.text).toBe("some text");
        expect(error.message).toBe("test:some-id: some text");
    });

    it("keeps the cause", function () {
        const cause = new globalThis.Error("inner");
        const error = new Error("test:outer", "outer", { cause });
        expect(error.cause).toBe(cause);
    });
});

describe("getErrorChain", function () {
    it("collects the error and its causes", function () {
        const inner = new globalThis.Error("inner");
        const middle = new Error("test:middle", "middle", { cause: inner });
        const outer = new Error("test:outer", "outer", { cause: middle });
        expect(getErrorChain(outer)).toEqual([outer, middle, inner]);
    });

    it("stops at a cause that is not an error", function () {
        const outer = new Error("test:outer", "outer", { cause: "a string" });
        expect(getErrorChain(outer)).toEqual([outer]);
    });
});

describe("throwAbortError", function () {
    it("should throw an AbortError", function () {
        expect(() => throwAbortError())
            .throw("Aborted")
            .and.to.have.property("name", "AbortError");
    });
});

describe("isAbortError", function () {
    it("should recognize our own errors", function () {
        const err = getAbortError();
        expect(isAbortError(err)).toBe(true);
    });

    it("should recognize abort errors from the DOM", function () {
        const err = new DOMException("Aborted", "AbortError");
        expect(isAbortError(err)).toBe(true);
    });
});

function getAbortError() {
    try {
        throwAbortError();
    } catch (e) {
        return e;
    }
}
