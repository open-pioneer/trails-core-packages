// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Alert,
    Box,
    Button,
    EmptyState,
    For,
    HStack,
    Progress,
    ProgressCircle,
    Skeleton,
    SkeletonCircle,
    Spinner,
    Stack,
    Status,
    VStack
} from "@chakra-ui/react";
import {
    NotificationLevel,
    NotificationOptions,
    NotificationService
} from "@open-pioneer/notifier";
import { useService } from "open-pioneer:react-hooks";
import { LuShoppingCart } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

export function Feedback() {
    const notifications = useService<NotificationService>("notifier.NotificationService");
    const emitNotification = (title: string, message: string, level: NotificationLevel) => {
        const options: NotificationOptions = {
            title,
            level: level,
            message: message,
            displayDuration: undefined
        };
        if (!options.title) {
            notifications.notify({
                title: "Title is required",
                level: "error"
            });
            return;
        }
        notifications.notify(options);
    };
    const clearNotifications = () => {
        notifications.closeAll();
    };

    return (
        <Box spaceY="4">
            <Presenter title="Alert" link="https://chakra-ui.com/docs/components/alert">
                <VStack gap={2}>
                    <Alert.Root status="neutral" title="This is the alert title">
                        <Alert.Indicator />
                        <Alert.Title>This is the alert title</Alert.Title>
                    </Alert.Root>
                    <Alert.Root status="info" title="This is the info title">
                        <Alert.Indicator />
                        <Alert.Title>This is the info title</Alert.Title>
                    </Alert.Root>
                    <Alert.Root status="success" title="This is the success title">
                        <Alert.Indicator />
                        <Alert.Title>This is the success title</Alert.Title>
                    </Alert.Root>
                    <Alert.Root status="warning" title="This is the warning title">
                        <Alert.Indicator />
                        <Alert.Title>This is the warning title</Alert.Title>
                    </Alert.Root>
                    <Alert.Root status="error" title="This is the error title">
                        <Alert.Indicator />
                        <Alert.Title>This is the error title</Alert.Title>
                    </Alert.Root>
                </VStack>
            </Presenter>

            <Presenter title="Empty State" link="https://chakra-ui.com/docs/components/empty-state">
                <EmptyState.Root borderColor="border.disabled" color="fg.disabled">
                    <EmptyState.Content>
                        <EmptyState.Indicator>
                            <LuShoppingCart />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                            <EmptyState.Title>Your cart is empty</EmptyState.Title>
                            <EmptyState.Description>
                                Explore our products and add items to your cart
                            </EmptyState.Description>
                        </VStack>
                    </EmptyState.Content>
                </EmptyState.Root>
            </Presenter>

            <Presenter
                title="Progress Circle"
                link="https://chakra-ui.com/docs/components/progress-circle"
            >
                <ProgressCircle.Root value={75}>
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track />
                        <ProgressCircle.Range />
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
            </Presenter>

            <Presenter title="Progress" link="https://chakra-ui.com/docs/components/progress">
                <Progress.Root maxW="240px">
                    <Progress.Track>
                        <Progress.Range />
                    </Progress.Track>
                </Progress.Root>
            </Presenter>

            <Presenter title="Skeleton" link="https://chakra-ui.com/docs/components/skeleton">
                <HStack gap="5">
                    <SkeletonCircle size="12" />
                    <Stack flex="1">
                        <Skeleton height="5" />
                        <Skeleton height="5" width="80%" />
                    </Stack>
                </HStack>
            </Presenter>

            <Presenter title="Spinner" link="https://chakra-ui.com/docs/components/spinner">
                <Spinner size="sm" />
            </Presenter>

            <Presenter title="Status" link="https://chakra-ui.com/docs/components/status">
                <HStack gap="6">
                    <Status.Root colorPalette="red">
                        <Status.Indicator />
                    </Status.Root>
                    <Status.Root colorPalette="blue">
                        <Status.Indicator />
                    </Status.Root>
                    <Status.Root colorPalette="orange">
                        <Status.Indicator />
                    </Status.Root>
                    <Status.Root colorPalette="green">
                        <Status.Indicator />
                    </Status.Root>
                </HStack>
            </Presenter>

            <Presenter
                title="Notifier (OPT)"
                link="https://www.npmjs.com/package/@open-pioneer/notifier"
            >
                <Box display="flex" gap="4">
                    <For each={["success", "info", "warning", "error"]}>
                        {(level) => (
                            <Button
                                key={level}
                                variant="surface"
                                onClick={() =>
                                    emitNotification(`${level} title`, `${level} message`, level)
                                }
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                        )}
                    </For>
                    <Button colorPalette="yellow" onClick={clearNotifications}>
                        Clear notifications
                    </Button>
                </Box>
            </Presenter>

            {/* NOTE: toast is not exported by open pioneer but has it's own notification system */}
        </Box>
    );
}
