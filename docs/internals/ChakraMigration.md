# Chakra Migration

-   Toaster snippet does not work by default.
    The toaster (`createToaster`) needs a reference to the root node (`#pioneer-root`),
    so it cannot be created at module scope.
    Create it from a hook or a react component instead, or use the NotificationService.
