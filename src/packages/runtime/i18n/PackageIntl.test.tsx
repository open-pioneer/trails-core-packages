// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Tag } from "@open-pioneer/chakra-integration";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createPackageIntl } from "./PackageIntl";

describe("formatRichMessage", () => {
    it("formats messages containing react nodes", async () => {
        const intl = createPackageIntl("en-US", {
            test: "Hello, {name}!"
        });
        const message = intl.formatRichMessage(
            {
                id: "test"
            },
            {
                name: <Tag>User</Tag>
            }
        );
        render(<Box data-testid="test">{message}</Box>);

        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
            class="css-0"
            data-testid="test"
          >
            Hello, 
            <span
              class="css-1qm7lvz"
            >
              User
            </span>
            !
          </div>
        `);
    });

    it("formats messages containing basic html tags", async () => {
        const intl = createPackageIntl("en-US", {
            test: "Hello, <strong>{name}</strong>!"
        });
        const message = intl.formatRichMessage(
            {
                id: "test"
            },
            {
                name: "User"
            }
        );
        render(<Box data-testid="test">{message}</Box>);

        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
            class="css-0"
            data-testid="test"
          >
            Hello, 
            <strong>
              User
            </strong>
            !
          </div>
        `);
    });

    it("supports defining custom tags", async () => {
        const intl = createPackageIntl("en-US", {
            test: "Hello, <custom1>Content of custom tag <custom2>and nested tag with {param}</custom2></custom1>!"
        });
        const message = intl.formatRichMessage(
            {
                id: "test"
            },
            {
                custom1: (parts) => {
                    return <Box className="from-custom-1">{parts}</Box>;
                },
                custom2: (parts) => {
                    return <Box className="from-custom-2">{parts}</Box>;
                },
                param: "value from outside"
            }
        );
        render(<Box data-testid="test">{message}</Box>);

        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
            class="css-0"
            data-testid="test"
          >
            Hello, 
            <div
              class="from-custom-1 css-0"
            >
              Content of custom tag 
              <div
                class="from-custom-2 css-0"
              >
                and nested tag with value from outside
              </div>
            </div>
            !
          </div>
        `);
    });
});
