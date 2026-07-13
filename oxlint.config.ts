// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { defineConfig, type OxlintConfig } from "oxlint";

export default defineConfig({
    plugins: ["typescript", "jsx-a11y", "react", "eslint", "import", "oxc", "promise", "vitest"],
    jsPlugins: ["@tony.ganchev/eslint-plugin-header"],
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
    rules: {
        "max-params": [
            "warn",
            {
                max: 4
            }
        ],
        "no-array-constructor": "error",
        "no-case-declarations": "error",
        "no-empty": "error",
        "no-fallthrough": "error",
        "no-prototype-builtins": "error",
        "no-regex-spaces": "error",
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
        "no-var": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "preserve-caught-error": "error",
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
        ],
        "import/no-duplicates": "error",
        "jsx-a11y/control-has-associated-label": "off",
        "oxc/branches-sharing-code": "warn",
        "oxc/no-accumulating-spread": "warn",
        "oxc/no-this-in-exported-function": "error",
        "react/display-name": "error",
        "react/exhaustive-deps": [
            "warn",
            {
                additionalHooks: "(useReactiveSnapshot|useComputed)"
            }
        ],
        "react/jsx-no-comment-textnodes": "error",
        "react/jsx-no-target-blank": "error",
        "react/no-unescaped-entities": "error",
        "react/no-unknown-property": "error",
        "react/react-in-jsx-scope": "off",
        "react/rules-of-hooks": "error",
        "react/self-closing-comp": "error",
        "typescript/ban-ts-comment": "error",
        "typescript/no-empty-object-type": "off",
        "typescript/no-explicit-any": "error",
        "typescript/no-namespace": "error",
        "typescript/no-non-null-assertion": "error",
        "typescript/no-require-imports": "error",
        "typescript/no-unnecessary-type-constraint": "error",
        "typescript/no-unsafe-function-type": "error",
        "typescript/triple-slash-reference": "error",
        "vitest/no-commented-out-tests": "error",
        "vitest/require-mock-type-parameters": "off"
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
