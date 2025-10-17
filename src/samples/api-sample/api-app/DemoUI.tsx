// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useService } from "open-pioneer:react-hooks";
import { TextService } from "./TextService";
import { Button, Container, VStack, Text, Heading } from "@chakra-ui/react";
import { ExternalEventService } from "@open-pioneer/integration";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";

export function DemoUI() {
    const eventService = useService<ExternalEventService>("integration.ExternalEventService");
    const emitEvent = () => {
        eventService.emitEvent("my-custom-event", {
            data: "my-event-data"
        });
    };

    const textService = useService<unknown>("api-app.TextService") as TextService;
    const text = useReactiveSnapshot(() => textService.getText(), [textService]);

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
