// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Button,
    CloseButton,
    Code,
    Container,
    Dialog,
    HStack,
    List,
    Menu,
    Portal,
    Text,
    VStack
} from "@chakra-ui/react";
import { NotificationService, Notifier } from "@open-pioneer/notifier";
import { TitledSection } from "@open-pioneer/react-utils";
import { ApplicationContext } from "@open-pioneer/runtime";
import { useService } from "open-pioneer:react-hooks";

export function AppUI() {
    return (
        <>
            <Notifier />
            <Container w="3xl">
                <TitledSection
                    title="Application without ShadowRoot"
                    sectionHeadingProps={{ mt: 4 }}
                >
                    <VStack align="start" gap={2} mt={2}>
                        <Text>
                            This application does not use a shadow root around the application{"'"}s
                            content. This mode is appropriate for applications that use the entire
                            browser viewport. In that case, the shadow root is not necessary to
                            avoid conflicts with other components and may actually be an obstacle
                            when integrating certain third party components.
                        </Text>
                        <Text>The following effects should be visible:</Text>
                        <List.Root>
                            <List.Item>
                                There is no shadow root inside the web component element. Instead,
                                the <Code>.pioneer-root</Code> Node is the immediate child of the
                                web component.
                            </List.Item>
                            <List.Item>
                                The application context does not report a shadow root. The root node
                                is the <Code>document</Code>.
                            </List.Item>
                            <List.Item>
                                Styles are mounted in the document head (Chakra styles and
                                application styles from <Code>styles.css</Code>).
                            </List.Item>
                            <List.Item>
                                Complex components like notifications, menus and modals should still
                                behave well and should be styled correctly. Portalled content should
                                still always be a child of <Code>.pioneer-root</Code>.
                            </List.Item>
                        </List.Root>
                    </VStack>

                    <TitledSection title="Test controls" sectionHeadingProps={{ mt: 4 }}>
                        <TestControls />
                    </TitledSection>
                </TitledSection>
            </Container>
        </>
    );
}

function TestControls() {
    const ctx = useService<ApplicationContext>("runtime.ApplicationContext");
    const notifier = useService<NotificationService>("notifier.NotificationService");

    return (
        <List.Root gap={3}>
            <List.Item>
                Nodes (open Browser console):
                <HStack>
                    <Button onClick={() => console.log(ctx.getRoot())}>Print Root Node</Button>
                    <Button onClick={() => console.log(ctx.getShadowRoot())}>
                        Print Shadow Root
                    </Button>
                </HStack>
            </List.Item>
            <List.Item>
                <DialogComponent />
            </List.Item>
            <List.Item>
                <MenuComponent />
            </List.Item>
            <List.Item>
                <Button
                    onClick={() => {
                        notifier.success({
                            title: "Well done",
                            message: "You clicked the button!"
                        });
                    }}
                >
                    Show notification
                </Button>
            </List.Item>
        </List.Root>
    );
}

function DialogComponent() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button>Open Dialog</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Dialog Title</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function MenuComponent() {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button>Open Menu</Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="new-txt">New Text File</Menu.Item>
                        <Menu.Item value="new-file">New File...</Menu.Item>
                        <Menu.Item value="new-win">New Window</Menu.Item>
                        <Menu.Item value="open-file">Open File...</Menu.Item>
                        <Menu.Item value="export">Export</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
}
