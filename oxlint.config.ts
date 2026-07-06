// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineConfig, type OxlintConfig } from "oxlint";

export default defineConfig({
    plugins: ["typescript", "jsx-a11y", "react"],
    categories: {
        correctness: "error"
    },
    env: {
        builtin: true
    },
    ignorePatterns: [
        "**/dist",
        "**/node_modules",
        "**/temp",
        "**/test-data",
        "support/licenses",
        "**/chakra-snippets",
        "**/.*"
    ],
    rules: {
        "no-case-declarations": "error",
        "no-empty": "error",
        "no-fallthrough": "error",
        "no-prototype-builtins": "error",
        "no-regex-spaces": "error",
        "no-array-constructor": "error",
        "no-var": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "no-unused-expressions": [
            "error",
            {
                allowShortCircuit: true,
                allowTernary: true
            }
        ],
        "no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                caughtErrors: "all",
                caughtErrorsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_"
            }
        ],
        "typescript/ban-ts-comment": "error",
        "typescript/no-explicit-any": "error",
        "typescript/no-namespace": "error",
        "typescript/no-non-null-assertion": "error",
        "typescript/no-require-imports": "error",
        "typescript/no-unnecessary-type-constraint": "error",
        "typescript/no-unsafe-function-type": "error",
        "typescript/triple-slash-reference": "error",
        "typescript/no-empty-object-type": "off",
        "react/display-name": "error",
        "react/jsx-no-comment-textnodes": "error",
        "react/jsx-no-target-blank": "error",
        "react/no-unescaped-entities": "error",
        "react/no-unknown-property": "error",
        "react/rules-of-hooks": "error",
        "react/react-in-jsx-scope": "off",
        "react/exhaustive-deps": [
            "warn",
            {
                additionalHooks: "(useReactiveSnapshot|useComputed)"
            }
        ],
        "jsx-a11y/control-has-associated-label": "off"
    },
    overrides: [
        {
            files: ["**/*.test.*"],
            rules: {
                "typescript/no-non-null-assertion": "off",
                "typescript/no-explicit-any": "off"
            }
        },
        {
            files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx", "**/*.mjs", "**/*.cjs"],
            rules: {
                "@tony.ganchev/header/header": [
                    "error",
                    {
                        header: {
                            commentType: "line",
                            lines: [
                                " SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)",
                                " SPDX-License-Identifier: Apache-2.0"
                            ]
                        }
                    }
                ]
            },
            jsPlugins: ["@tony.ganchev/eslint-plugin-header"]
        }
    ]
} satisfies OxlintConfig);
