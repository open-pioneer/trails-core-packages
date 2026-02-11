// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
/**
 * @module
 *
 * @groupDescription Headings
 *
 * Implements automatic heading levels. Use {@link TitledSection} and {@link SectionHeading} instead of raw `h1`, `h2`, ... tags.
 *
 * @groupDescription Roving menu
 *
 * A (render-less) implementation of the roving tab index pattern.
 * Useful as a building block for custom accessible menus.
 *
 * @groupDescription Common component props
 *
 * A basic hook that enforces some common properties and patterns shared by all major trails UI components.
 */

// useEvent
export { useEvent } from "./useEvent";

// TitledSection
export {
    type TitledSectionProps,
    TitledSection,
    type SectionHeadingProps,
    SectionHeading,
    type ConfigureTitledSectionProps,
    ConfigureTitledSection,
    type HeadingLevel,
    useHeadingLevel
} from "./TitledSection";

// Common component props
export {
    type CommonComponentProps,
    type CommonComponentContainerProps,
    useCommonComponentProps
} from "./useCommonComponentProps";

// Roving menu
export { RovingMenuRoot, type RovingMenuRootProps } from "./roving-menu/RovingMenuRoot";
export {
    useRovingMenu,
    type RovingMenuProps,
    type RovingMenuResult
} from "./roving-menu/useRovingMenu";
export {
    useRovingMenuItem,
    type RovingMenuItemProps,
    type RovingMenuItemResult
} from "./roving-menu/useRovingMenuItem";
export { type RovingMenuState } from "./roving-menu/RovingMenuState";

// Generic helpers
export { mergeChakraProps } from "./mergeChakraProps";
