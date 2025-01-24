// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
export type NotificationLevel = "DEBUG" | "INFO" | "ERROR";

/** Package properties supported by this package. */
export interface PropertiesAppProps {
    /** Notification level used by this app. Defaults to `INFO` */
    notifierLevel?: NotificationLevel;
}
