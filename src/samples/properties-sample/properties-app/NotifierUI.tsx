// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AlertStatus, useToast } from "@open-pioneer/chakra-integration";
import { useService } from "open-pioneer:react-hooks";
import { useEffect } from "react";
import { NotificationLevel, Notifier } from "./api";

const STATUS_MAP: Record<NotificationLevel, AlertStatus | undefined> = {
    DEBUG: undefined,
    INFO: "info",
    ERROR: "error"
};

/**
 * Shows a toast when the notifier service emits a notification.
 */
export function NotifierUI() {
    const notifier = useService<Notifier>("properties-app.Notifier");
    const toast = useToast();
    useEffect(() => {
        const handle = notifier.on("show-notification", (n) => {
            toast({
                position: "bottom-right",
                title: n.message,
                isClosable: true,
                status: STATUS_MAP[n.level]
            });
        });
        return () => handle.destroy();
    }, [notifier, toast]);
    return null;
}
