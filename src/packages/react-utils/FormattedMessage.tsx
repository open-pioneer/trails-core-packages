// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { getValue, ReactiveGetter, ReadonlyReactive } from "@conterra/reactivity-core";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import type { PackageIntl, RichTextValue } from "@open-pioneer/runtime";
import {
    type FormatXMLElementFn,
    type Options as IntlMessageFormatOptions,
    type PrimitiveType
} from "intl-messageformat"; // not a dependency, this is a dependency of formatjs
import { useMemo } from "react";

/**
 * Shared formatting operations.
 *
 * @group Formatting
 */
export interface FormattingBaseProps {
    /**
     * The `intl` object of the package rendering the message.
     * Must contain a message associated with the given {@link id}.
     *
     * Note that this value can be a direct instance, or a signal / reactive getter implemented
     * in terms of the Reactivity API.
     */
    intl: PackageIntl | ReadonlyReactive<PackageIntl> | ReactiveGetter<PackageIntl>;
}

/**
 * Props supported by {@link FormattedMessage}.
 *
 * @group Formatting
 */
export interface FormattedMessageProps extends FormattingBaseProps {
    /** The message's id. */
    id: string;

    /**
     * Formatting values used to parametrize the message.
     * Also supports callbacks, see {@link PackageIntl.formatMessage}.
     */
    values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>;

    /** Additional options for the formatting operation. */
    opts?: IntlMessageFormatOptions;
}

/**
 * Renders the result of formatting a message using the provided intl object.
 *
 * Example:
 *
 * ```tsx
 * <FormattedMessage intl={intl} id="message.id" />
 * ```
 *
 * @expandType FormattedMessageProps
 * @group Formatting
 */
export function FormattedMessage(props: FormattedMessageProps) {
    const { id, values, opts } = props;
    const intl = useReactiveIntl(props);
    return useMemo(
        () => String(intl.formatMessage({ id }, values, opts)),
        [intl, id, values, opts]
    );
}

/**
 * Props supported by {@link FormattedRichMessage}.
 *
 * @group Formatting
 */
export interface FormattedRichMessageProps extends FormattingBaseProps {
    /** The message's id. */
    id: string;

    /**
     * Formatting values used to parametrize the message.
     * Also supports callbacks, see {@link PackageIntl.formatRichMessage}.
     */
    values?: Record<string, RichTextValue>;

    /** Additional options for the formatting operation. */
    opts?: IntlMessageFormatOptions;
}

/**
 * Renders the result of formatting a message using the provided intl object.
 *
 * Example:
 *
 * ```tsx
 * <FormattedRichMessage intl={intl} id="message.id" />
 * ```
 *
 * @expandType FormattedRichMessageProps
 * @group Formatting
 */
export function FormattedRichMessage(props: FormattedRichMessageProps) {
    const { id, values, opts } = props;
    const intl = useReactiveIntl(props);
    return useMemo(() => intl.formatRichMessage({ id }, values, opts), [intl, id, values, opts]);
}

function useReactiveIntl({ intl }: FormattingBaseProps) {
    return useReactiveSnapshot(() => {
        if (typeof intl === "function") {
            // reactive getter
            return intl();
        }
        return getValue(intl);
    }, [intl]);
}
