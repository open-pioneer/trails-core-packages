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

    Sample Workaround (-> reusable component?). Simply wrap the the react icons in a span or div.
    Chakra will style the span and the icon child with fill its parent.

    ```jsx
    <ChakraIcon {...props} asChild>
        <span>
            <SomeReactIconsIcon style={{ width: "100%", height: "100%" }} />
        </span>
    </ChakraIcon>
    ```

- Theme
  // TODO describe that theming has changed (new docu in starter repo)
    - Semantic tokens of chakra have been renamed and to no longer have a prefix. Thus, we added prefix to the tokens in the trails theme. Tokens that have been used in the projects need to be renamed (see Charka 3 PR for details).
