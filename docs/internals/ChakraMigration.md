# Chakra Migration

-   Toaster snippet does not work by default.
    The toaster (`createToaster`) needs a reference to the root node (`#pioneer-root`),
    so it cannot be created at module scope.
    Create it from a hook or a React component instead, or use the NotificationService.
-   The Tooltip snippet is not lazy by default.
    It is recommended to use the `Tooltip` component with the following props:
    ```jsx
    lazyMount={true}
    unmountOnExit={true}
    ```
    // TODO: provide a custom snippet for the Tooltip component
