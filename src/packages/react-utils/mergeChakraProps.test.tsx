// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it, vi } from "vitest";
import { mergeChakraProps } from "./mergeChakraProps";
import { render, screen } from "@testing-library/react";
import { Box } from "@chakra-ui/react";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";

it("merges classnames", () => {
    const merged = mergeChakraProps(
        {
            className: "foo"
        },
        {
            className: "bar"
        }
    );
    expect(merged.className).toBe("foo bar");
});

it("merges normal attributes", () => {
    const merged = mergeChakraProps(
        {
            "data-foo": 123
        },
        {
            backgroundColor: "green.500"
        }
    );
    expect(merged).toMatchInlineSnapshot(`
      {
        "backgroundColor": "green.500",
        "data-foo": 123,
      }
    `);
});

it("later arguments overwrite earlier ones", () => {
    const merged = mergeChakraProps(
        {
            "x": 1
        },
        {
            "x": 2
        }
    );
    expect(merged.x).toBe(2);
});

it("merges event listener functions", () => {
    const a = vi.fn();
    const b = vi.fn();
    const merged = mergeChakraProps(
        {
            onClick: a
        },
        {
            onClick: b
        }
    );
    expect(merged.onClick).toBeTypeOf("function");

    merged.onClick();
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
});

describe("css property", () => {
    it("plainly forwards css property when present once", () => {
        const merged = mergeChakraProps(
            {
                color: "green.solid"
            },
            {
                css: {
                    backgroundColor: "blue.solid"
                }
            }
        );
        expect(merged.css).toEqual({
            backgroundColor: "blue.solid"
        });
    });

    it("merges multiple css objects into an array", () => {
        const merged = mergeChakraProps(
            {
                css: {
                    "&:hover": {
                        color: "green.solid"
                    }
                }
            },
            {
                css: {
                    "&:hover:not(:disabled)": {
                        backgroundColor: "white"
                    }
                }
            }
        );
        expect(merged).toMatchInlineSnapshot(`
          {
            "css": [
              {
                "&:hover": {
                  "color": "green.solid",
                },
              },
              {
                "&:hover:not(:disabled)": {
                  "backgroundColor": "white",
                },
              },
            ],
          }
        `);
    });

    it("supports css arrays as inputs", () => {
        const merged = mergeChakraProps(
            {
                css: [
                    {
                        "&:hover": {
                            color: "green.solid"
                        }
                    }
                ]
            },
            {
                css: [
                    {
                        "&:hover:not(:disabled)": {
                            backgroundColor: "white"
                        }
                    }
                ]
            }
        );
        expect(merged).toMatchInlineSnapshot(`
          {
            "css": [
              {
                "&:hover": {
                  "color": "green.solid",
                },
              },
              {
                "&:hover:not(:disabled)": {
                  "backgroundColor": "white",
                },
              },
            ],
          }
        `);
    });

    it("renders combined styles", async () => {
        const merged = mergeChakraProps(
            {
                css: {
                    color: "#fff",
                    backgroundColor: "blue",
                    "&.custom-class": {
                        fontSize: "12px",
                        fontWeight: "800"
                    }
                }
            },
            {
                css: {
                    color: "red",
                    "&.custom-class": {
                        fontSize: "14px"
                    }
                }
            }
        );

        expect(merged).toMatchInlineSnapshot(`
          {
            "css": [
              {
                "&.custom-class": {
                  "fontSize": "12px",
                  "fontWeight": "800",
                },
                "backgroundColor": "blue",
                "color": "#fff",
              },
              {
                "&.custom-class": {
                  "fontSize": "14px",
                },
                "color": "red",
              },
            ],
          }
        `);

        await render(<Box className="custom-class" data-testid="box" {...merged} />, {
            wrapper: (props) => <PackageContextProvider {...props} />
        });

        const box = await screen.findByTestId("box");
        expect(box).toHaveStyle("color: red");
        expect(box).toHaveStyle("background-color: blue");
        expect(box).toHaveStyle("font-size: 14px"); // second rule has priority
        expect(box).toHaveStyle("font-weight: 800"); // first rule but not overwritten
    });
});
