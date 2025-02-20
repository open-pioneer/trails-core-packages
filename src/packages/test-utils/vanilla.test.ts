// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it, afterEach, vi } from "vitest";
import { createIntl } from "./vanilla";

afterEach(() => {
    vi.restoreAllMocks();
});

it("creates an intl object", () => {
    const intl = createIntl();
    expect(intl.locale).toBe("en");
});

it("creates an intl object with custom locale", () => {
    const intl = createIntl({
        locale: "de"
    });
    expect(intl.locale).toBe("de");
});

it("creates an intl object with custom messages", () => {
    const intl = createIntl({
        messages: {
            "foo.bar": "baz"
        }
    });
    const message = intl.formatMessage({ id: "foo.bar" });
    expect(message).toBe("baz");
});

it("renders the message id and does not warn if a message is not defined", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const intl = createIntl({
        messages: {}
    });
    const message = intl.formatMessage({ id: "foo.bar" });
    expect(message).toBe("foo.bar");
    expect(spy).not.toHaveBeenCalled();
});
