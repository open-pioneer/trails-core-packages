// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Button, Container, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { NotificationService, Notifier } from "@open-pioneer/notifier";
import { useProperties, useService } from "open-pioneer:react-hooks";
import { useMemo, useState } from "react";
import { NotificationLevel, PropertiesAppProps } from "./api";
import { Field } from "./snippets/field";

export function AppUI() {
    return (
        <>
            <Notifier />
            <Form />
        </>
    );
}

function Form() {
    const { packageLevel, emitNotification } = useNotifications();
    const [message, setMessage] = useState("");
    const onClick = (level: NotificationLevel) => {
        if (!message) {
            return;
        }
        emitNotification(level, message);
    };

    return (
        <Container maxWidth="xl">
            <VStack my="20">
                <Heading size="md">Notifier Sample</Heading>
                <Text>
                    This Form attempts to emit a notification with a certain level when clicking one
                    of the button below. The notifier will ignore notifications with a level lower
                    than <strong>{packageLevel}</strong>. The notifier&apos;s level can be
                    configured using an attribute on the web component element.
                </Text>
                <Field
                    label="Enter a message and click one of the buttons to emit a notification"
                    pt="3"
                >
                    <Input
                        placeholder="Notification text..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                    />
                </Field>
                <HStack>
                    <Button onClick={onClick.bind(undefined, "DEBUG")}>Debug</Button>
                    <Button onClick={onClick.bind(undefined, "INFO")}>Info</Button>
                    <Button onClick={onClick.bind(undefined, "ERROR")}>Error</Button>
                </HStack>
            </VStack>
        </Container>
    );
}

function useNotifications() {
    const properties = useProperties() as PropertiesAppProps;
    const packageLevel = properties.notifierLevel ?? "INFO";
    const notifier = useService<NotificationService>("notifier.NotificationService");
    return useMemo(() => {
        return {
            packageLevel,
            emitNotification(level: NotificationLevel, message: string) {
                if (LEVELS[packageLevel] > LEVELS[level]) {
                    // Ignore, message is not important enough
                    return;
                }

                notifier.notify({
                    message: `${message} (${level})`,
                    level: "info"
                });
            }
        };
    }, [notifier, packageLevel]);
}

const LEVELS: Record<NotificationLevel, number> = {
    DEBUG: 0,
    INFO: 1,
    ERROR: 2
};
