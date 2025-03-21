// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    ButtonGroup,
    Container,
    Heading,
    Input,
    Stack,
    Text,
    Textarea
} from "@chakra-ui/react";
import {
    NotificationLevel,
    NotificationOptions,
    NotificationService,
    Notifier
} from "@open-pioneer/notifier";
import { useService } from "open-pioneer:react-hooks";
import { useState } from "react";
import { Checkbox } from "./snippets/checkbox";
import { NativeSelectField, NativeSelectRoot } from "./snippets/native-select";
import { Field } from "./snippets/field";

export function AppUI() {
    const notifications = useService<NotificationService>("notifier.NotificationService");
    const [title, setTitle] = useState("");
    const [level, setLevel] = useState("info");
    const [message, setMessage] = useState("");
    const [autoHide, setAutoHide] = useState(false);
    const emitNotification = () => {
        const options: NotificationOptions = {
            title,
            level: level as NotificationLevel, // quick and dirty, we only allow supported strings in select
            message: message,
            displayDuration: autoHide ? 5000 : undefined
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
        <>
            <Notifier />
            <Container maxWidth="xl" p={5}>
                <Stack gap={8}>
                    <Stack align="center">
                        <Heading as="h1">Notify Sample</Heading>
                        <Text>Use the form below to emit notifications.</Text>
                    </Stack>
                    <Box rounded="lg" boxShadow="lg" p={8}>
                        <Stack gap={4}>
                            <Field label="Title" required>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Field>
                            <Field label="Level" required>
                                <NativeSelectRoot>
                                    <NativeSelectField
                                        value={level}
                                        onChange={(e) => {
                                            setLevel(e.target.value);
                                        }}
                                        items={[
                                            { value: "success", label: "Success" },
                                            { value: "info", label: "Info" },
                                            { value: "warning", label: "Warning" },
                                            { value: "error", label: "Error" }
                                        ]}
                                    />
                                </NativeSelectRoot>
                            </Field>
                            <Field label="Message">
                                <Textarea
                                    placeholder="Enter additional message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </Field>
                            <Checkbox
                                checked={autoHide}
                                onCheckedChange={(e) => setAutoHide(!!e.checked)}
                            >
                                Hide after 5 seconds
                            </Checkbox>
                            <ButtonGroup justifyContent="center">
                                <Button onClick={emitNotification}>Emit Notification</Button>
                                <Button colorPalette="red" onClick={clearNotifications}>
                                    Clear notifications
                                </Button>
                            </ButtonGroup>
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </>
    );
}
