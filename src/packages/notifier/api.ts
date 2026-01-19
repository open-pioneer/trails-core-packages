// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from "react";
import type { DeclaredService } from "@open-pioneer/runtime";

/** Represents the severity or kind of a notification. */
export type NotificationLevel = "success" | "info" | "warning" | "error";

/**
 * Options used when emitting a new notification via {@link NotificationService.notify}.
 */
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

/**
 * Options used when emitting a new notification via {@link NotificationService}
 * using convenience methods like `warning` and `error`.
 *
 * Options can either be an object that is the same as {@link NotificationOptions}, but without the `level` property
 * or a string, which will be used as the `message` of the Notification.
 */
export type SimpleNotificationOptions = Omit<NotificationOptions, "level"> | string;

/**
 * The `NotificationService` allows any part of the application to emit
 * notifications to the user.
 *
 * You can inject an instance of this service by referencing the interface name `notifier.NotificationService`.
 */
export interface NotificationService extends DeclaredService<"notifier.NotificationService"> {
    /**
     * Emits a new notification.
     *
     * Notifications are shown by the `<Notifier />` component,
     * which must be present in your application.
     *
     * @param options Options for the new notification.
     */
    notify(options: NotificationOptions): void;

    /** Emits a success notification. Same as {@link notify} with `type: "success"`. */
    success(options: SimpleNotificationOptions): void;

    /** Emits an info notification. Same as {@link notify} with `type: "info"`. */
    info(options: SimpleNotificationOptions): void;

    /** Emits a warning notification. Same as {@link notify} with `type: "warning"`. */
    warning(options: SimpleNotificationOptions): void;

    /** Emits an error notification. Same as {@link notify} with `type: "error"`. */
    error(options: SimpleNotificationOptions): void;

    /** Closes all active notifications. */
    closeAll(): void;
}

/**
 * Offsets from the edge of the screen; one css value for each edge.
 */
export interface OffsetsObject {
    left: string;
    top: string;
    right: string;
    bottom: string;
}

/**
 * Properties supported by this package.
 */
export interface NotifierProperties {
    /**
     * The position for new notifications.
     *
     * @default "top-right"
     */
    position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

    /**
     * Offset from the edge of the screen.
     *
     * See also https://chakra-ui.com/docs/components/toast#offset.
     */
    offsets?: string | OffsetsObject | null;
}
