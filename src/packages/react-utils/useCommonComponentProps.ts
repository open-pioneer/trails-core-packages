// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { SystemStyleObject } from "@chakra-ui/react";
import classNames from "classnames";
import { HTMLAttributes, AriaAttributes, useMemo, AriaRole } from "react";

/**
 * Common properties supported by all public react components.
 *
 * This type allows for the customization of
 * - the css `className`
 * - a Chakra `css` property
 * - "role" and `aria-*` properties
 * - arbitrary `data-*` properties
 *
 * Prop types for react components typically inherit from this interface.
 *
 * @group Common component props
 */
export interface CommonComponentProps extends AriaAttributes {
    /**
     * Additional class name(s).
     */
    className?: string;

    /**
     * Custom style rules using Chakra's style objects.
     */
    css?: SystemStyleObject | SystemStyleObject[];

    /**
     * Custom ARIA role.
     */
    role?: AriaRole;

    /**
     * Used for testing.
     */
    "data-testid"?: string;

    /**
     * Arbitrary data attributes.
     *
     * NOTE: The component may use data properties for its own behavior.
     * Make sure not to overwrite required attributes.
     */
    [key: `data-${string}`]: unknown;
}

const COPY_PROP_RE = /^(data|aria)-/;

/**
 * @group Common component props
 */
export interface CommonComponentContainerProps
    extends Pick<HTMLAttributes<HTMLElement>, "className" | "role">, AriaAttributes {
    css?: SystemStyleObject | SystemStyleObject[];
    [key: `data-${string}`]: unknown;
}

/**
 * A helper hook that computes react properties for the topmost container in a public react component.
 *
 * Example:
 *
 * ```jsx
 * function MyComponent(props) {
 *     const { containerProps } = useCommonComponentProps("my-component", props);
 *     // automatically applies css classes and testid
 *     return <Box {...containerProps}>Content</Box>;
 * }
 * ```
 *
 * @group Common component props
 * @expandType CommonComponentProps
 */
export function useCommonComponentProps(
    componentClassName: string,
    props: CommonComponentProps
): { containerProps: CommonComponentContainerProps } {
    const result = useMemo(() => {
        const containerProps: Record<string, unknown> = {
            className: classNames(componentClassName, props.className)
        };
        if (props.role) {
            containerProps.role = props.role;
        }
        if (props.css) {
            containerProps.css = props.css;
        }
        for (const k in props) {
            if (!Object.hasOwn(props, k)) {
                continue;
            }
            if (COPY_PROP_RE.test(k)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                containerProps[k] = (props as any)[k];
            }
        }
        return { containerProps };
    }, [componentClassName, props]);
    return result;
}
