// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Heading, HeadingProps } from "@chakra-ui/react";
import { FC, ReactNode, RefAttributes, createContext, useContext } from "react";

const LevelContext = createContext<number | undefined>(undefined);
LevelContext.displayName = "LevelContext";

/**
 * Properties of the {@link TitledSection} component.
 *
 * @group Headings
 **/
export interface TitledSectionProps {
    /**
     * The title component.
     *
     * Strings are automatically wrapped in a {@link SectionHeading}.
     * More complex nodes should use the {@link SectionHeading} internally.
     */
    title?: string | ReactNode | undefined;

    /**
     * Properties for the automatically generated section heading.
     *
     * NOTE: This is only applied if `title` is a string.
     */
    sectionHeadingProps?: SectionHeadingProps | undefined;

    /**
     * Children are rendered without any modifications.
     */
    children?: ReactNode | undefined;
}

/**
 * Automatically manages the level of html headings such as `h1` and `h2`.
 *
 * Use this component's `title` property or `<SectionHeading />` components in the children
 * of this component instead of manual heading tags.
 * Nested sections will automatically use the correct level for their current location.
 *
 * Titles are rendered as [Chakra Headings](https://chakra-ui.com/docs/components/heading) by default.
 *
 * **Example:** Simple string headings (1, 2 and 3 will be rendered as h1, h2 and h3):
 *
 * ```jsx
 * <TitledSection title="1">
 *     Top level content
 *
 *     <TitledSection title="2" sectionHeadingProps={...}>
 *         Nested content
 *
 *         <TitledSection title="3">
 *             Deeply nested content
 *         </TitledSection>
 *     </TitledSection>
 * </TitledSection>
 * ```
 *
 * When using using a string for the `title` prop, you can specify the `sectionHeadingProps` to
 * customize the properties of the automatically generated heading component.
 *
 * **Example:** custom section headings as children
 *
 * ```jsx
 * <TitledSection>
 *    <SectionHeading>Top level heading (H1)</SectionHeading>
 *
 *    .. Some Content ..
 *
 *    <TitledSection>
 *        <SectionHeading>Other Heading (H2)</SectionHeading>
 *
 *        .. More Content ..
 *    </TitledSection>
 *
 * </TitledSection>
 * ```
 *
 * > NOTE: You should use exactly one `<SectionHeading />` for each `<TitledSection />`.
 * > The SectionHeading can appear anywhere, for example wrapped in other layout components.
 *
 * **Example:** custom title rendering
 *
 * You can also use completely custom components for the title.
 * In this case, you should ensure that you use the `SectionHeading` component within the `title` in some place.
 * The section heading does not need to be the immediate child, you can wrap it any way you want.
 *
 * ```jsx
 * <TitledSection
 *     title={
 *         <SectionHeading size="4xl">Heading</SectionHeading>
 *     }
 * >
 *     Content
 * </TitledSection>
 * ```
 *
 * @group Headings
 * @expandType TitledSectionProps
 */
export function TitledSection(props: TitledSectionProps): ReactNode {
    const { title, sectionHeadingProps, children } = props;
    const currentLevel = useContext(LevelContext) ?? 0;
    const heading =
        typeof title === "string" ? (
            <SectionHeading {...sectionHeadingProps}>{title}</SectionHeading>
        ) : (
            title
        );

    return (
        <LevelContext value={currentLevel + 1}>
            {heading}
            {children}
        </LevelContext>
    );
}

/**
 * Properties supported by the {@link SectionHeading} component.
 *
 * All chakra properties are forwarded to the [Heading](https://chakra-ui.com/docs/components/heading) component.
 *
 * @group Headings
 */
export interface SectionHeadingProps extends HeadingProps, RefAttributes<HTMLHeadingElement> {
    children?: ReactNode | undefined;
}

/**
 * Renders an appropriate heading tag for the current heading level (`h1` through `h6`).
 * This component should only be used as part of the `title` prop of the {@link TitledSection}.
 *
 * Headings are rendered as [Chakra Headings](https://chakra-ui.com/docs/components/heading).
 *
 * Heading levels are managed by nesting {@link TitledSection}.
 *
 * @group Headings
 * @expandType SectionHeadingProps
 */
export function SectionHeading(props: SectionHeadingProps): ReactNode {
    const { children, ref, ...rest } = props;
    const level = useHeadingLevel();
    const tag = getHeadingTag(level);
    return (
        <Heading as={tag} ref={ref} {...rest}>
            {children}
        </Heading>
    );
}

/**
 * Properties for the {@link ConfigureTitledSection} component.
 *
 * @group Headings
 */
export interface ConfigureTitledSectionProps {
    level: HeadingLevel;
    children?: ReactNode;
}

/**
 * Overrides the heading level for all children.
 *
 * TitledSection components nested in `children` will start with the configured level.
 * Nested TitledSections will continue to use the next appropriate heading level.
 *
 * Example: Changing the global heading level for your application
 *
 * If your application is embedded into another site, it should often not use the `h1` tag
 * but start with a higher heading level instead. To achieve that, simply wrap your application
 * with `<ConfigureTitledSectionProps>`. No other code changes are necessary:
 *
 * ```jsx
 * <ConfigureTitledSection level={2}>
 *     <TheRestOfYourApplication />
 * </ConfigureTitledSection>
 * ```
 *
 * Example: Embedding a widget
 *
 * Given a `<Widget />` (that we cannot easily change) that internally uses `TitledSection`,
 * this is how we can embed it with a custom heading level.
 * This can be appropriate in some circumstances, for example when the react component tree does not match the DOM
 * tree (portals etc.).
 *
 * ```jsx
 * <ConfigureTitledSection level={5}>
 *     <Widget />
 * </ConfigureTitledSection>
 * ```
 *
 * The headings used by `Widget` will start with `h5`.
 *
 * @group Headings
 * @expandType ConfigureTitledSectionProps
 */
export const ConfigureTitledSection: FC<ConfigureTitledSectionProps> = (props) => {
    const level = props.level - 1; // TitledSection increments by 1.
    return <LevelContext value={level}>{props.children}</LevelContext>;
};

/**
 * The level of a html heading.
 * @group Headings
 **/
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Returns the current heading level.
 *
 * This hook should be used in the `title` property of a {@link TitledSection} or in that component's children.
 *
 * @group Headings
 */
export function useHeadingLevel(): HeadingLevel {
    const level = useContext(LevelContext);
    if (level == null) {
        throw new Error("useHeadingLevel() must be used within a <TitledSection />");
    }
    return Math.max(1, Math.min(level, 6)) as HeadingLevel;
}

function getHeadingTag(level: HeadingLevel): `h${HeadingLevel}` {
    return `h${level}`;
}
