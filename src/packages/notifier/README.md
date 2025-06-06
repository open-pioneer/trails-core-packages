# @open-pioneer/notifier

This package allows a developer to emit global notifications from any application component and provides a component to display the notifications.

## Usage

### Displaying notifications in an application

The `<Notifier />` must be used in your app's UI , otherwise notifications from application components are not shown. It should be present exactly once.

```jsx
import { Notifier } from "@open-pioneer/notifier";

export function AppUI() {
    return (
        <>
            <Notifier />
            {/* The rest of your application */}
        </>
    );
}
```

> Note: In most cases the notifier should be located at or near the root of your app's UI.

The implementation of `<Notifier />` is based on [Chakra's Toast](https://chakra-ui.com/docs/components/toast).

### Configuring the notifier

The notifier can be configured by specifying the following _package properties_:

```ts
export interface NotifierProperties {
    /**
     * The position for new notifications.
     *
     * @default "top-right"
     */
    position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";
}
```

For example, to show notifications in the top-left corner of your application:

```ts
// app.ts
const Element = createCustomElement({
    // ...
    config: {
        properties: {
            "@open-pioneer/notifier": {
                position: "top-left"
            } satisfies NotifierProperties
        }
    }
    // or use resolveConfig()
});
```

### Emitting notifications

Reference the interface name `notifier.NotificationService` to inject an instance of `NotificationService`.
That service can be used to emit events from any service or UI component in the application:

```ts
const notificationService = ...; // injected
notificationService.notify({
    level: "info",
    title: "Job complete",
    message: "Optional additional message ..."
})
```

All options in `notify` are optional, but at least the `title` or `message` should be specified.

The following options are supported by the service:

```ts
export type NotificationLevel = "success" | "info" | "warning" | "error";

export interface NotificationOptions {
    /** The title of the notification. */
    title?: string | ReactNode | undefined;

    /** An optional message, shown below the title. */
    message?: string | ReactNode | undefined;

    /**
     * The level of this notification.
     * @default "info"
     */
    level?: NotificationLevel | undefined;

    /**
     * The duration (in milliseconds) how long the notification is displayed.
     * By default, notifications are displayed until they are explicitly closed by the user.
     *
     * Note that important messages should not be hidden automatically for a11y reasons.
     */
    displayDuration?: number | undefined;
}
```

### Closing all notifications

All currently displayed notifications can be closed by calling the `closeAll` method on the `NotificationService`:

```ts
const notificationService = ...; // injected
notificationService.closeAll();
```

## License

Apache-2.0 (see `LICENSE` file)
