// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useService } from "open-pioneer:react-hooks";
import { TextService } from "./TextService";
import { Button, Container, VStack, Text, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ExternalEventService } from "@open-pioneer/integration";

export function DemoUI() {
    const eventService = useService<ExternalEventService>("integration.ExternalEventService");
    const emitEvent = () => {
        eventService.emitEvent("my-custom-event", {
            data: "my-event-data"
        });
    };

    const textService = useService<unknown>("api-app.TextService") as TextService;
    const [text, setText] = useState("");
    useEffect(() => {
        setText(textService.getText());
        const handle = textService.on("text-changed", (event) => {
            setText(event.newText);
        });
        return () => handle.destroy();
    }, [textService]);

    return (
        <Container maxWidth="xl">
            <VStack>
                <Heading size="md">Emitting Events</Heading>
                <Text>Click this button to emit a browser event:</Text>
                <Button onClick={emitEvent}>Emit Event</Button>

                <Heading size="md" pt={20}>
                    Reacting to API calls from the host site
                </Heading>
                <div>Current text: {text}</div>
            </VStack>
        </Container>
    );
}
