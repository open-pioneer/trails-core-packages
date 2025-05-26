# Chakra Migration from v2 to v3

- Toaster snippet does not work by default.
  The toaster (`createToaster`) needs a reference to the root node (`#pioneer-root`),
  so it cannot be created at module scope.
  Create it from a hook or a React component instead, or use the NotificationService.

    NOTE: Finding may be slightly outdated since the toaster has received some fixes in the meantime.
    However, the general recommendation to use the notifier instead still stands.

- Checkbox / Radios: Cursor does not change to pointer on hover.
  // TODO: check why this is the default behaviour (in Chakra)

    TODO: Fixed via theme?

- React icons + Chakra `<Icon />` do not work together well by default.
  This is a bug with react icons (see https://github.com/chakra-ui/chakra-ui/issues/9227 and https://github.com/react-icons/react-icons/issues/336).

    Sample Workaround (-> reusable component?). Simply wrap the react icons in a span or div.
    Chakra will style the span and the icon child with fill its parent.

    ```jsx
    <ChakraIcon {...props} asChild>
        <span>
            <SomeReactIconsIcon style={{ width: "100%", height: "100%" }} />
        </span>
    </ChakraIcon>
    ```

- Chakra's `<Icon />` applies `aria-hidden="true"` by default.

    This is good in general, but hurts when you assigned an `aria-label` to the icon manually.
    The `aria-hidden` attribute can be overwritten:

    ```jsx
    <Icon
        color="red"
        className="warning-icon"
        aria-label={status.reason}
        aria-hidden={undefined} // Overwrite icon default so the label gets read (can also use "false")
    >
        <FiAlertTriangle />
    </Icon>
    ```

    Alternatively, you can label the parent element instead.

    NOTE: if you use raw svgs (e.g. directly using the react-icons components) you need to

    - assign a label / alt text yourself OR
    - set `aria-hidden=true`

- Theming mechanism has changed

    - Use mergeConfigs to merge the base theme with your custom theme (instead of extendTheme). Pass theme to chakraConfig in createCustomElement in app.ts
    - Adjust theme config object to match the new Chakra 3 theme structure of the style SystemConfig object (many changes, see Chakra 3 PR for details). To overwrite the default color scheme, you need to specify the color scheme as a token, then set specific semantic tokens and set the colorPalette property in the globalCss object.
    - Removed custom semantics tokens where possible (if chakra has native support). Examples: background_body, background_primary.
    - Added a new prefix to custom semantic tokens (trails\_\*) to avoid conflicts with other tokens / css variables.
    - Tokens that have been used in the projects need to be renamed (see Chakra 3 PR for details).
    - `theme` export of `@open-pioneer/base-theme` has been renamed to `config` (of type `SystemConfig`).

- @open-pioneer/chakra-integration has been removed
- @open-pioneer/runtime-react-support has been removed. This was an internal package.
