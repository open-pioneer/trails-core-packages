// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/**
 * @vitest-environment happy-dom
 */
import { isAbortError, throwAbortError } from "./error";
import { it, expect, describe } from "vitest";

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
