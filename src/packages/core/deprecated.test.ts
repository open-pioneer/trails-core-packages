// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { afterEach, expect, it, vi } from "vitest";
import { deprecated } from "./deprecated";

afterEach(() => {
    vi.restoreAllMocks();
});

it("prints a message when deprecated functionality is used", () => {
    const logSpy = vi.spyOn(console, "warn").mockImplementation(doNothing);

    const helper = deprecated({
        name: "SomeClass",
        packageName: "some-package",
        since: "v1.2.3"
    });
    expect(logSpy).not.toHaveBeenCalled();

    helper();
    expect(logSpy).toHaveBeenCalledOnce();

    helper();
    expect(logSpy).toHaveBeenCalledOnce(); // not logged a second time

    const message = logSpy.mock.calls[0]![0];
    expect(message).toMatchInlineSnapshot(
        `"⚠️ DEPRECATED: SomeClass in some-package (since v1.2.3) - Please update your code as this may be removed in future versions."`
    );
});

function doNothing() {}
