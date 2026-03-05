# @open-pioneer/react-utils

This package provides React utilities that help a developer create applications.

## Usage

### Titled sections

Use the `<TitledSection>` and `<SectionHeading>` components instead of raw `hX` HTML tags (such as `<h1>` or `<h2>`).
This way, the appropriate heading level is determined automatically.

Example:

```jsx
import { TitledSection, SectionHeading } from "@open-pioneer/react-utils";

function SomeComponent(props) {
    return (
        {/* Renders as h1 if this is the topmost section.
            Title strings are automatically wrapped into `SectionHeading`. */}
        <TitledSection title="Root Title">
            ... Some content ...
            {/* Custom react component as title. Renders as the next level (h2). */}
            <TitledSection title={<SectionHeading size="4xl">Sub Title</SectionHeading>}>
                ... More content ...
            </TitledSection>
        </TitledSection>
    );
}
```

To override the automatic heading level, use the `ConfigureTitledSection` component.
This can be used for example to override the initial heading level or to force a certain level when the React tree differs from the DOM tree.

Example:

```jsx
<ConfigureTitledSection level={2}>
    <TheRestOfYourApplication />
</ConfigureTitledSection>
```

In the preceding example the topmost heading(s) in `TheRestOfYourApplication` start at level 2, and nested headings use increasing levels as usual.
For more details, see the API documentation.

### Roving menu

The roving menu is a render-less component that can be used to implement an accessible menu with keyboard navigation.
It implements focus management and supports navigation using the arrow keys and home/end buttons.

To create a roving menu, use the `useRovingMenu` hook in combination with the `RovingMenuRoot`.
You must apply the `menuProps` to some container element (a `div`, a list, etc.) and the `menuState` to the `<RovingMenuRoot />`, which acts as a context provider.

For example:

```tsx
import { useRovingMenu, RovingMenuRoot } from "@open-pioneer/react-utils";

function HorizontalMenu() {
    const { menuProps, menuState } = useRovingMenu({
        orientation: "horizontal"
    });

    return (
        <HStack {...menuProps} justify="center" gap={5} padding={2}>
            <RovingMenuRoot menuState={menuState}>
                <MenuItem value="1" />
                <MenuItem value="2" />
                <MenuItem value="3" />
                <MenuItem value="4" />
            </RovingMenuRoot>
        </HStack>
    );
}
```

To implement a menu item, use the `useRovingMenuItem` hook.
You must provide a unique value for the item (unique within the menu).
You must also make certain to apply the resulting `itemProps` to the menu item component (which can be any focusable DOM element).
These props implement keyboard navigation and focus handling.

For example:

```tsx
function MenuItem(props: { value: string }) {
    const { value } = props;
    const { itemProps } = useRovingMenuItem({
        value
    });

    return (
        <Button {...itemProps} onClick={() => console.log(`Button ${value} triggered.`)}>
            {value}
        </Button>
    );
}
```

#### Disabled menu items

Use the `disabled` prop of `useRovingMenuItem` to indicate that your menu item is currently disabled.
Disabled items will lose focus and will be skipped during keyboard navigation.

To mark your items as disabled for your users, prefer `aria-disabled` over HTML's `disabled` attribute.
The `disabled` attribute completely disables focus and any browser events, which makes moving the focus to a neighboring item difficult to implement.

#### Unmounting / hiding menu items

`display: none` in combination with a `disabled: true` in `useRovingMenuItem` works well.
As an alternative, you can also completely unmount your component from a parent of your menu item.

Note that returning `null` or `undefined` from your component will interfere with focus handling.
You should always render your menu item's dom node, for as long as your item exists.

#### Nested menus

Roving menu supports limited nesting (2 levels deep).

For the outer menu, use the normal `useRovingMenu()` hook with a certain orientation.
For the child menu, use the `useNestedRovingMenu()` hook with the _opposite_ orientation.

The child menu will act as an item in its parent menu, so it requires a `value` as well.

Example for the child menu:

```tsx
function NestedMenu() {
    const { menuProps, menuState } = useNestedRovingMenu({
        orientation: "horizontal",
        value: "some-value"
    });

    return (
        <HStack {...menuProps} justify="center" gap={5} padding={2}>
            <RovingMenuRoot menuState={menuState}>{/* nested items ... */}</RovingMenuRoot>
        </HStack>
    );
}
```

### Hooks

#### useCommonComponentProps()

A helper hook that automatically computes `containerProps`: common properties to set on the topmost container element of a public component.

For the time being, these properties are `className` (combined component class and optional additional class names) and `data-testid` (for tests).

Example:

```tsx
// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { CommonComponentProps, useCommonComponentProps } from "@open-pioneer/react-utils";
// ...

// Inherit from CommonComponentProps
export interface InitialExtentProps extends CommonComponentProps {
    // props ...
}

export const InitialExtent: FC<InitialExtentProps> = (props: InitialExtentProps) => {
    // Use the hook to compute container props (classNames, data-testid, maybe more in the future)
    const { containerProps } = useCommonComponentProps("initial-extent", props);

    // Pass containerProps directly to the container
    return <Box {...containerProps}>{/* ... */}</Box>;
};
```

#### useEvent()

The `useEvent` can be used to obtain a stable event handler function with changing implementation.
This is useful to avoid re-triggering `useEffect`-hooks when only the event handler changed.

Example:

```jsx
import { useEvent } from "@open-pioneer/react-utils";

function SomeReactComponent(props) {
    // NOTE: logMessage() must not be called during rendering!
    const logMessage = useEvent((message: string) => {
        console.log(message, props.someProperty);
    });
    const someService = ...; // injected

    // Changes of prop.someProperty will not cause the effect to re-fire, because the function identity
    // of `logMessage` remains stable.
    useEffect(() => {
        const handle = someService.registerHandler(logMessage);
        return () => handle.destroy();
    }, [someService, logMessage]);
}
```

> Warning: the function returned by `useEvent` must **not** be called during rendering.  
> It can only be used in an effect or in a event handler callback.

For more details, see the API docs of `useEvent` or <https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md>.

## License

Apache-2.0 (see `LICENSE` file)
