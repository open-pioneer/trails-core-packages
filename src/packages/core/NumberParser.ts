// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/**
 * This class allows to parse numbers from strings according to the given locale.
 * Currently, in JavaScript there is no built-in way to parse numbers according to the current locale.
 * Only arabic numerals are supported.
 */
export class NumberParser {
    private readonly decimalRegexPattern: RegExp;
    private readonly groupingRegexPattern: RegExp;

    constructor(locales: Intl.LocalesArgument) {
        const numberFormatOptions: Intl.NumberFormatOptions = {
            useGrouping: true
        };
        const formattedParts = new Intl.NumberFormat(locales, numberFormatOptions).formatToParts(
            12345.6
        );

        const decimalSeparator = formattedParts.find((part) => part.type === "decimal")?.value;
        if (!decimalSeparator) {
            throw new Error("Could not determine decimal separator.");
        }

        const groupingSeparator = formattedParts.find((part) => part.type === "group")?.value;
        if (!groupingSeparator) {
            throw new Error("Could not determine grouping separator.");
        }

        this.decimalRegexPattern = new RegExp(`${this.escapeRegExp(decimalSeparator)}`, "g");
        if (groupingSeparator.trim() === "") {
            // if a language uses a whitespace as grouping separator, remove all whitespaces (as numbers may not contain whitespaces)
            this.groupingRegexPattern = /\s/g;
        } else {
            this.groupingRegexPattern = new RegExp(`${this.escapeRegExp(groupingSeparator)}`, "g");
        }
    }

    /**
     * Parses a number from a string considering the locale.
     */
    parse(numberString: string): number {
        numberString = numberString.trim();

        const parsedNumberString = numberString
            .replace(this.groupingRegexPattern, "")
            .replace(this.decimalRegexPattern, ".");
        return !parsedNumberString ? NaN : +parsedNumberString;
    }

    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
    private escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
}
