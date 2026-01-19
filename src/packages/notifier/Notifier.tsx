// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Toaster as ChakraToaster,
    Icon,
    Portal,
    Spinner,
    Stack,
    Toast,
    useToastStyles
} from "@chakra-ui/react";
import { useIntl, useService } from "open-pioneer:react-hooks";
import { memo, useEffect, useState } from "react";
import { LuTriangleAlert, LuInfo, LuCircleCheck, LuCircleAlert } from "react-icons/lu";
import { InternalNotificationAPI, ToasterObject } from "./NotificationServiceImpl";

/** Props supported by the {@link Notifier} component. */
export interface NotifierProps {}

/**
 * Shows notifications sent via the `NotificationService`.
 *
 * Only one instance of `<Notifier />` should be present in the application.
 * It currently does not matter where the Notifier is located in the react tree.
 *
 * ```ts
 * import { Notifier } from "@open-pioneer/notifier";
 *
 * export function AppUI() {
 *     return (
 *         <>
 *             <Notifier />
 *             <h1>Your application</h1>
 *         </>
 *     );
 * }
 * ```
 */
export function Notifier(_props: NotifierProps) {
    const notificationService = useService(
        "notifier.NotificationService"
    ) as InternalNotificationAPI;
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handle = notificationService.registerUI();
        if (!handle) {
            return;
        }

        setActive(true);
        return () => {
            setActive(false);
            handle.destroy();
        };
    }, [notificationService]);

    return active && <Toaster toaster={notificationService.toaster} />;
}

const Toaster = memo(function Toaster(props: { toaster: ToasterObject }) {
    const intl = useIntl();
    return (
        <Portal>
            <ChakraToaster
                className="notifier-toast-group"
                insetInline={{ mdDown: "4" }}
                aria-label={intl.formatMessage({
                    id: "regionLabel"
                })}
                toaster={props.toaster}
            >
                {(toast) => (
                    <Toast.Root className="notifier-toast" width={{ md: "sm" }} alignItems="center">
                        {toast.type === "loading" ? (
                            <Spinner size="sm" color="blue.solid" />
                        ) : (
                            <ToastIndicator type={toast.type ?? ""} />
                        )}
                        <Stack gap="1" flex="1" maxWidth="100%">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && (
                                <Toast.Description>{toast.description}</Toast.Description>
                            )}
                        </Stack>
                        {toast.action && (
                            <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
                        )}
                        {toast.meta?.closable && (
                            <Toast.CloseTrigger
                                cursor="pointer"
                                aria-label={intl.formatMessage({
                                    id: "notification.close"
                                })}
                            />
                        )}
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    );
});

const icons: Record<string, React.ElementType> = {
    info: LuInfo,
    success: LuCircleCheck,
    warning: LuCircleAlert,
    error: LuTriangleAlert
};

function ToastIndicator(props: { type: string }) {
    const styles = useToastStyles();

    const Component = icons[props.type];
    if (!Component) return null;

    return (
        <Icon css={styles.indicator}>
            <span>
                <Component style={{ width: "100%", height: "100%" }} />
            </span>
        </Icon>
    );
}
