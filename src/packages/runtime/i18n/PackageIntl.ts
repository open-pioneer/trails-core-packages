// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    createIntl,
    createIntlCache,
    IntlConfig,
    IntlErrorCode,
    IntlFormatters,
    IntlShape,
    MessageDescriptor,
    OnErrorFn
} from "@formatjs/intl";
import {
    type FormatXMLElementFn,
    type Options as IntlMessageFormatOptions,
    type PrimitiveType
} from "intl-messageformat"; // not a dependency, this is a dependency of formatjs
import { Children, createElement, Fragment, isValidElement, ReactNode } from "react";

type BaseIntl = Pick<IntlShape, "locale" | "timeZone"> &
    Omit<IntlFormatters<string>, "formatMessage">;

/**
 * Gives access to the package's i18n messages for the current locale.
 *
 * See also https://formatjs.io/docs/intl
 */
export type PackageIntl = BaseIntl & PackageIntlExtensions;

/**
 * Trails specific extensions to FormatJS' intl API.
 */
export interface PackageIntlExtensions {
    /**
     * Formats a message with the given descriptor and values.
     *
     * This is a method directly implemented by FormatJS see
     * - [Documentation](<https://formatjs.github.io/docs/intl/#formatmessage>)
     * - {@link IntlShape.formatMessage | Base Implementation}
     *
     * The typings here make the signature a little bit stricter: only primitive values
     * are allowed for formatting.
     *
     * If you need rich text (react) formatting, see {@link PackageIntlExtensions.formatRichMessage}.
     */
    formatMessage(
        this: void,
        descriptor: MessageDescriptor,
        values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
        opts?: IntlMessageFormatOptions
    ): string;

    /**
     * Similar to `formatMessage()`, but supports _rich text formatting_.
     *
     * React nodes are supported as input values, and custom tags can be implemented as react components.
     * Note that the output is always a single react node.
     *
     * *Example with react node as value:*
     *
     * ```tsx
     * function Example() {
     *   const intl = useIntl();
     *   // Given i18n message "Hello, {name}!"
     *   // replaces 'name' with the given react node:
     *   const message = intl.formatRichMessage({ id: "foo"}, {
     *     name: <FancyUserName />
     *   });
     *   return <Box>{message}</Box>;
     * }
     * ```
     *
     * *Example with basic formatting:*
     *
     * ```tsx
     * function Example() {
     *   const intl = useIntl();
     *   // Given i18n message "Hello, <strong>{name}</strong>!"
     *   // renders with actual <strong> html node:
     *   return <Box>{intl.formatRichMessage({ id: "foo"}, { name: "User" })}</Box>;
     * }
     * ```
     *
     * Note that only a few basic formatting tags are predefined ("b", "strong", "i", "em", "code", "br").
     * If you need more advanced tags, you can define your own, see below.
     *
     * *Example with custom tag:*
     *
     * ```tsx
     * function Example() {
     *   const intl = useIntl();
     *   // Given i18n message "Open <foo>the door</foo>!",
     *   // renders 'foo' using the formatter function below:
     *   const message = intl.formatRichMessage({ id: "foo"}, {
     *     foo: (parts) => <FancyTag>{parts}</FancyTag>
     *   });
     *   return <Box>{message}</Box>;
     * }
     * ```
     */
    formatRichMessage: (
        descriptor: MessageDescriptor,
        values?: Record<string, RichTextValue>,
        opts?: IntlMessageFormatOptions
    ) => ReactNode;
}

/**
 * Value types supported when rendering rich text messages.
 * Primitive values (or single react nodes) are used for normal values.
 * Functions are used to define how tags should be rendered.
 *
 * See {@link PackageIntlExtensions.formatRichMessage}
 */
export type RichTextValue = PrimitiveType | ReactNode | FormatXMLElementFn<ReactNode>;

/**
 * Creates a package intl instance with the given locale and messages.
 *
 * @internal
 */
export function createPackageIntl(
    locale: string,
    messages: Record<string, string>,
    options?: {
        /** Used during testing to suppress console messages. */
        suppressNotFoundError?: boolean;

        /** Also used during testing */
        defaultLocale?: string;
    }
): PackageIntl {
    const cache = createIntlCache();
    const config: IntlConfig = {
        locale,
        messages
    };
    if (options?.suppressNotFoundError) {
        config.onError = ignoreMissingTranslationError;
    }
    if (options?.defaultLocale) {
        config.defaultLocale = options.defaultLocale;
    }

    const intl = createIntl(config, cache) as unknown as PackageIntl;
    intl.formatRichMessage = formatRichMessage.bind(undefined, intl);
    return intl;
}

/** Creates an empty i18n instance, e.g. for tests. */
export function createEmptyPackageIntl(locale = "en"): PackageIntl {
    return createPackageIntl(locale, {});
}

const RICH_TEXT_TAGS = Object.freeze({
    "b": renderTag("b"),
    "strong": renderTag("strong"),
    "i": renderTag("i"),
    "em": renderTag("em"),
    "code": renderTag("code"),
    "br": renderTag("br")
});

function formatRichMessage(
    intl: PackageIntl,
    descriptor: MessageDescriptor,
    values: Record<string, RichTextValue> | undefined,
    opts: IntlMessageFormatOptions | undefined
): ReactNode {
    values = {
        ...RICH_TEXT_TAGS,
        ...values
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chunks: any = intl.formatMessage(descriptor, preprocessValues(values) as any, opts);
    const nodes = assignKeys(chunks);
    return createElement(Fragment, undefined, ...nodes);
}

function preprocessValues(values: Record<string, RichTextValue> | undefined) {
    if (!values) {
        return undefined;
    }

    const fixedValues: Record<string, RichTextValue> = {};
    for (const [key, valueOrFn] of Object.entries(values)) {
        let fixedValue = valueOrFn;
        if (typeof valueOrFn === "function") {
            fixedValue = (parts) => valueOrFn(assignKeys(parts));
        }
        fixedValues[key] = fixedValue;
    }
    return fixedValues;
}

function renderTag(tag: string): FormatXMLElementFn<ReactNode> {
    return function renderRichTag(parts) {
        return createElement(tag, undefined, ...parts);
    };
}

// Seems to be required to get rid of "key" warnings.
// See https://github.com/formatjs/formatjs/pull/4895/files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignKeys(chunks: any): any[] {
    const nodes = Children.map(chunks, assignKey) ?? [];
    return Children.toArray(nodes);
}

const ANY_KEY = { key: 42 };

function assignKey(reactNode: React.ReactNode) {
    return isValidElement(reactNode) ? createElement(Fragment, ANY_KEY, reactNode) : reactNode;
}

/** Hides missing translation errors during tests */
const ignoreMissingTranslationError: OnErrorFn = (err) => {
    if (err.code === IntlErrorCode.MISSING_TRANSLATION) {
        return;
    }

    console.error(err);
};
