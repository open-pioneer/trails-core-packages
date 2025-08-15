// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Tag } from "@chakra-ui/react";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
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
                name: (
                    <Tag.Root>
                        <Tag.Label>User</Tag.Label>
                    </Tag.Root>
                )
            }
        );
        renderBox(message);

        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
            data-testid="test"
          >
            Hello, 
            <div
              class="chakra-tag__root css-fs7q9r"
            >
              <span
                class="chakra-tag__label css-1v61si9"
              >
                User
              </span>
            </div>
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
        renderBox(message);

        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
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
        renderBox(message);

        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
            data-testid="test"
          >
            Hello, 
            <div
              class="from-custom-1"
            >
              Content of custom tag 
              <div
                class="from-custom-2"
              >
                and nested tag with value from outside
              </div>
            </div>
            !
          </div>
        `);
    });

    it("does not error for static strings", async () => {
        const intl = createPackageIntl("en-US", {
            test: "hi"
        });
        const message = intl.formatRichMessage({
            id: "test"
        });
        const nodes = dumpReactTree(message);
        expect(nodes).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "key": "<no key>",
                "type": "primitive",
                "value": "hi",
              },
            ],
            "key": "<no key>",
            "type": Symbol(react.fragment),
          }
        `);
    });

    it("assigns unique keys to children and nested children", async () => {
        const intl = createPackageIntl("en-US", {
            test: "a <nested2><code>b</code> c <nested1> d <code>e</code> f <code>g</code> h</nested1></nested2>"
        });
        const message = intl.formatRichMessage(
            {
                id: "test"
            },
            {
                nested1(parts) {
                    return <Box className="nested1">{parts}</Box>;
                },
                nested2(parts) {
                    return <Box className="nested2">{parts}</Box>;
                },
                h: "foo"
            }
        );

        renderBox(message);
        const element = await screen.findByTestId("test");
        expect(element).toMatchInlineSnapshot(`
          <div
            data-testid="test"
          >
            a 
            <div
              class="nested2"
            >
              <code>
                b
              </code>
               c 
              <div
                class="nested1"
              >
                 d 
                <code>
                  e
                </code>
                 f 
                <code>
                  g
                </code>
                 h
              </div>
            </div>
          </div>
        `);

        const nodes = dumpReactTree(message);
        expect(nodes).toMatchSnapshot();
    });
});

it("generates a type error when using formatMessage with non-primitive types", async () => {
    const intl = createPackageIntl("en-US", {
        test: "Hello, {name}!"
    });
    const message = intl.formatMessage(
        {
            id: "test"
        },
        {
            // @ts-expect-error Only primitive types are supported
            name: {}
        }
    );

    // This would need some postprocessing to work well in react, which is why formatRichMessage() exists.
    expect(message).toMatchInlineSnapshot(`
    [
      "Hello, ",
      {},
      "!",
    ]
  `);
});

interface TreeNode {
    type: string;
    key: string;
    value?: string;
    children?: TreeNode[];
}

function dumpReactTree(node: any): TreeNode {
    if (node == null || typeof node === "boolean" || typeof node === "string") {
        return {
            type: "primitive",
            key: "<no key>",
            value: node
        };
    }

    const type = node.type || "<no type>";
    const key = node.key || "<no key>";
    const children = node.props?.children;

    const treeNode: TreeNode = {
        type,
        key
    };
    if (children) {
        const childrenArray = Array.isArray(children) ? children : [children];
        treeNode.children = childrenArray.map((child: any) => dumpReactTree(child));
    }
    return treeNode;
}

function renderBox(content: ReactNode) {
    return render(
        <PackageContextProvider>
            <Box data-testid="test">{content}</Box>
        </PackageContextProvider>
    );
}
