// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, type OxlintConfig } from "oxlint";

export default defineConfig({
    plugins: ["typescript", "jsx-a11y", "react", "eslint", "import", "oxc", "promise", "vitest"],
    categories: {
        correctness: "error",
        perf: "warn"
    },
    env: {
        builtin: true,
        browser: true
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
    // todo: sort rules list
    // todo: fix warnings and errors
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
        "vitest/require-mock-type-parameters": "off",
        "eslint/max-params": "warn", // todo set max to 4
        "react/self-closing-comp": "error",
        "import/no-duplicates": "error",

        "oxc/no-this-in-exported-function": "error",
        "no-accumulating-spread": "warn",
        // Todo add prefix to all rules? When are they needed?
        "branches-sharing-code": "warn",
        "no-commented-out-tests": "error",
        "eslint/preserve-caught-error": "error",
        "eslint/no-var": "error",
        "react/exhaustive-deps": [
            "warn",
            {
                additionalHooks: "(useReactiveSnapshot|useComputed)"
            }
        ],
        "jsx-a11y/control-has-associated-label": "off",
        "@tony.ganchev/header/header": [
            "error",
            {
                header: {
                    commentType: "line",
                    lines: [
                        " SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)",
                        " SPDX-License-Identifier: Apache-2.0"
                    ]
                },
                // Separate imports from license header
                "trailingEmptyLines": {
                    "minimum": 2
                }
            }
        ]
    },
    overrides: [
        {
            files: ["**/*.test.*"],
            rules: {
                "typescript/no-non-null-assertion": "off",
                "typescript/no-explicit-any": "off"
            }
        }
    ]
} satisfies OxlintConfig);
