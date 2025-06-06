// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Button, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useService } from "open-pioneer:react-hooks";
import { useMemo } from "react";
import { ActionService } from "./api";

export function ActionsUI() {
    const service = useService<ActionService>("extension-app.ActionService");
    const buttons = useMemo(
        () =>
            service.getActionInfo().map(({ id, text }) => (
                <Button key={id} onClick={() => service.triggerAction(id)}>
                    {text}
                </Button>
            )),
        [service]
    );

    return (
        <Container maxW="3xl" py={2}>
            <Heading as="h1" size="4xl" mb={4}>
                Extension Example
            </Heading>

            <VStack gap={4}>
                <Text>
                    This example demonstrates how to provide an extensible API with services and
                    1-to-N dependencies.
                </Text>
                <Text>
                    Individual <code>ActionProvider</code> instances can provide a number of
                    actions, which are then gathered and indexed by the <code>ActionService</code>,
                    which depends on all ActionProviders. The UI references the{" "}
                    <code>ActionService</code> and renders the provided actions as buttons. When a
                    button is clicked, the appropriate action will be triggered.
                </Text>
                <Text>
                    To add a new action, simply add new implementation of{" "}
                    <code>&quot;extension-app.ActionProvider&quot;</code>. The{" "}
                    <code>ActionService</code> will pick it up automatically.
                </Text>

                <Heading as="h2" size="xl">
                    Buttons from <code>ActionService</code>:
                </Heading>
                <VStack width="100%" align="start">
                    {buttons}
                </VStack>
            </VStack>
        </Container>
    );
}
