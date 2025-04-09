// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createToaster, CreateToasterProps, CreateToasterReturn } from "@chakra-ui/react";
import type {
    NotificationLevel,
    NotificationOptions,
    NotificationService,
    NotifierProperties,
    SimpleNotificationOptions
} from "./api";
import { Resource, createLogger } from "@open-pioneer/core";
import { ApplicationContext, ServiceOptions } from "@open-pioneer/runtime";
const LOG = createLogger("notifier:NotificationService");

export type ToasterObject = CreateToasterReturn;

export interface ToastMeta {
    closable: boolean;
}

export interface InternalNotificationAPI extends NotificationService {
    // Toasts in here carry `ToastMeta` metadata
    readonly toaster: ToasterObject;
    registerUI(): Resource | undefined;
}

interface References {
    appCtx: ApplicationContext;
}

// 7 days. Needed because there is no "indefinite" timeout for tooltips in current chakra.
const PERSISTENT_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

export class NotificationServiceImpl implements InternalNotificationAPI {
    #uiPresent = false;
    #uiCheckTimeoutId: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    readonly toaster: ToasterObject;

    constructor({ properties }: ServiceOptions<References>) {
        const typedProperties = properties as NotifierProperties;

        this.toaster = createToaster({
            placement: getPlacement(typedProperties.position),
            pauseOnPageIdle: true,
        });

        if (import.meta.env.DEV && !import.meta.env.VITEST) {
            this.#uiCheckTimeoutId = setTimeout(() => {
                this.#checkUiNotification();
                this.#uiCheckTimeoutId = undefined;
            }, 5000);
        }
    }

    destroy() {
        clearTimeout(this.#uiCheckTimeoutId);
        this.#uiCheckTimeoutId = undefined;
    }

    notify(options: NotificationOptions): void {
        this.toaster.create({
            type: options.level ?? "info",
            title: options.title,
            description: options.message,

            // Chakra currently has no concept of persistent toasts (other than type "loading"),
            // so we just use a very long timeout instead.
            // Note: MAX_VALUE or Infinity does not work either (probably too big for some computations made internally).
            duration: options.displayDuration ?? PERSISTENT_TIMEOUT,

            // Additional data for the toast (can be arbitrary)
            meta: {
                closable: true
            } satisfies ToastMeta
        });
    }

    success(options: SimpleNotificationOptions): void {
        this.#sendSimpleNotification("success", options);
    }

    info(options: SimpleNotificationOptions): void {
        this.#sendSimpleNotification("info", options);
    }

    warning(options: SimpleNotificationOptions): void {
        this.#sendSimpleNotification("warning", options);
    }

    error(options: SimpleNotificationOptions): void {
        this.#sendSimpleNotification("error", options);
    }

    #sendSimpleNotification(level: NotificationLevel, options: SimpleNotificationOptions): void {
        if (typeof options === "string") {
            options = { message: options };
        }
        this.notify({ ...options, level });
    }

    closeAll(): void {
        this.toaster.dismiss();
    }

    registerUI(): Resource | undefined {
        // We only support exactly one handler.
        if (this.#uiPresent) {
            LOG.warn(
                "A notifier UI has already been registered; this new component will be ignored.\n" +
                    "The <Notifier /> component has likely been used twice in your application."
            );
            return undefined;
        }

        this.#uiPresent = true;
        let destroyed = false;
        return {
            destroy: () => {
                if (destroyed) {
                    return;
                }

                destroyed = true;
                this.#uiPresent = false;
            }
        };
    }

    #checkUiNotification() {
        if (!this.#uiPresent) {
            LOG.warn(
                `No notifier UI has been registered: notifications will not be visible.\n` +
                    `Make sure that your app contains the <Notifier /> component.`
            );
        }
    }
}

// Map to chakra placement
function getPlacement(
    configPosition: NotifierProperties["position"] = "top-right"
): CreateToasterProps["placement"] {
    switch (configPosition) {
        case "top":
            return "top";
        case "top-left":
            return "top-start";
        case "top-right":
            return "top-end";
        case "bottom":
            return "bottom";
        case "bottom-left":
            return "bottom-start";
        case "bottom-right":
            return "bottom-end";
        default:
            return "top-end";
    }
}
