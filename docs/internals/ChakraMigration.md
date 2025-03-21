# Chakra Migration

- Toaster snippet does not work by default.
  The toaster (`createToaster`) needs a reference to the root node (`#pioneer-root`),
  so it cannot be created at module scope.
  Create it from a hook or a React component instead, or use the NotificationService.
- The Tooltip snippet is not lazy by default.
  It is recommended to use the `Tooltip` component with the following props:
    ```jsx
    lazyMount={true}
    unmountOnExit={true}
    ```
    // TODO: provide a custom snippet for the Tooltip component
- Checkbox / Radios: Cursor does not change to pointer on hover.
  // TODO: check why this is the default behaviour (in Chakra)

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

- Theming mechanism has changed
    - Use mergeConfigs to merge the base theme with your custom theme (instead of extendTheme). Pass theme to chakraConfig in createCustomElement in app.ts
    - Adjust theme config object to match the new Chakra 3 theme structure of the style SystemConfig object (many changes, see Chakra 3 PR for details). To overwrite the default color scheme, you need to specify the color scheme as a token, then set specific semantic tokens and set the colorPalette property in the globalCss object.
    - Semantic tokens of chakra have been renamed and to no longer have a prefix. Thus, we added a prefix to the custom tokens in the trails theme. Tokens that have been used in the projects need to be renamed (see Charka 3 PR for details).
