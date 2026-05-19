// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";
import { createIntl } from "@open-pioneer/test-utils/vanilla";
import { render } from "@testing-library/react";
import { disableReactActWarnings } from "test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormattedMessage, FormattedRichMessage } from "./FormattedMessage";

beforeEach(() => {
    disableReactActWarnings();
});

describe("FormatMessage", () => {
    it("renders plain strings", () => {
        const intl = createTestIntl("Hello {name}");
        const result = render(
            <FormattedMessage intl={intl} id="test" values={{ name: "World" }} />
        );
        expect(result.container.textContent).toBe("Hello World");
    });

    it("supports reactive changes of 'intl' using signals", async () => {
        const intl = reactive(createTestIntl("Message 1"));
        const result = render(<FormattedMessage intl={intl} id="test" />);
        expect(result.container.textContent).toBe("Message 1");

        intl.value = createTestIntl("Message 2");
        await vi.waitFor(() => {
            expect(result.container.textContent).toBe("Message 2");
        });
    });

    it("supports reactive changes via reactive getter", async () => {
        const intl = reactive(createTestIntl("Message 1"));
        const result = render(<FormattedMessage intl={() => intl.value} id="test" />);
        expect(result.container.textContent).toBe("Message 1");

        intl.value = createTestIntl("Message 2");
        await vi.waitFor(() => {
            expect(result.container.textContent).toBe("Message 2");
        });
    });
});

describe("FormatRichMessage", () => {
    it("renders react nodes", () => {
        const intl = createTestIntl("Hello {name}");
        const result = render(
            <FormattedRichMessage
                intl={intl}
                id="test"
                values={{
                    name: <span className="my-span">React</span>
                }}
            />
        );
        expect(result.container).toMatchInlineSnapshot(`
          <div>
            Hello 
            <span
              class="my-span"
            >
              React
            </span>
          </div>
        `);
    });
});

function createTestIntl(message: string) {
    return createIntl({
        locale: "en",
        messages: {
            "test": message
        }
    });
}
