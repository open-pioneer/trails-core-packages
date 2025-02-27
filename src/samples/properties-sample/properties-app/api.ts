// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { type EventSource } from "@open-pioneer/core";
import { type DeclaredService } from "@open-pioneer/runtime";

export type NotificationLevel = "DEBUG" | "INFO" | "ERROR";

export interface Notification {
    message: string;
    level: NotificationLevel;
}

export interface NotifierEvents {
    "show-notification": Notification;
}

export interface Notifier
    extends EventSource<NotifierEvents>,
        DeclaredService<"properties-app.Notifier"> {
    readonly level: NotificationLevel;

    /**
     * Attempts to emit a notification.
     * Notifications with a level lower than the configured level will not be emitted.
     *
     * Emits the "show-notification" event on success.
     */
    notify(message: string, level?: NotificationLevel): void;
}
