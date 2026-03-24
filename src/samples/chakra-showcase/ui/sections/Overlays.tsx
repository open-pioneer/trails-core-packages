// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    ActionBar,
    Avatar,
    Box,
    Button,
    Checkbox,
    CloseButton,
    createOverlay,
    Dialog,
    Drawer,
    HoverCard,
    HStack,
    Icon,
    Input,
    Link,
    Menu,
    Popover,
    Portal,
    Stack,
    Text
} from "@chakra-ui/react";
import { ToggleTip } from "@open-pioneer/chakra-snippets/toggle-tip";
import { Tooltip } from "@open-pioneer/chakra-snippets/tooltip";
import { useState } from "react";
import { LuChartLine, LuInfo, LuShare, LuTrash2 } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

interface DialogProps {
    title: string;
    description?: string;
    content?: React.ReactNode;
}

export function Overlays() {
    const [showActionBar, setShowActionBar] = useState(false);

    const dialog = createOverlay<DialogProps>((props: DialogProps) => {
        const { title, description, content, ...rest } = props;
        return (
            <Dialog.Root {...rest}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            {title && (
                                <Dialog.Header>
                                    <Dialog.Title>{title}</Dialog.Title>
                                </Dialog.Header>
                            )}
                            <Dialog.Body spaceY="4">
                                {description && (
                                    <Dialog.Description>{description}</Dialog.Description>
                                )}
                                {content}
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        );
    });

    return (
        <Box display="flex" flexDirection="column" gap="4" alignItems="flex-start">
            <Presenter title="Action Bar" link="https://chakra-ui.com/docs/components/action-bar">
                <Checkbox.Root onCheckedChange={(e) => setShowActionBar(!!e.checked)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Show Action bar</Checkbox.Label>
                </Checkbox.Root>

                <ActionBar.Root open={showActionBar}>
                    <Portal>
                        <ActionBar.Positioner>
                            <ActionBar.Content>
                                <ActionBar.SelectionTrigger>2 selected</ActionBar.SelectionTrigger>
                                <ActionBar.Separator />
                                <Button variant="outline" size="sm">
                                    <LuTrash2 />
                                    Delete
                                </Button>
                                <Button variant="outline" size="sm">
                                    <LuShare />
                                    Share
                                </Button>
                            </ActionBar.Content>
                        </ActionBar.Positioner>
                    </Portal>
                </ActionBar.Root>
            </Presenter>

            <Presenter title="Dialog" link="https://chakra-ui.com/docs/components/dialog">
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button variant="outline" size="sm">
                            Open Dialog
                        </Button>
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
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua.
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
            </Presenter>

            <Presenter title="Drawer" link="https://chakra-ui.com/docs/components/drawer">
                <Drawer.Root>
                    <Drawer.Trigger asChild>
                        <Button variant="outline" size="sm">
                            Open Drawer
                        </Button>
                    </Drawer.Trigger>
                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Drawer Title</Drawer.Title>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua.
                                    </p>
                                </Drawer.Body>
                                <Drawer.Footer>
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Save</Button>
                                </Drawer.Footer>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Drawer.CloseTrigger>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            </Presenter>

            <Presenter title="Hover Card" link="https://chakra-ui.com/docs/components/hover-card">
                <HoverCard.Root size="sm">
                    <HoverCard.Trigger asChild>
                        <Link href="#">@chakra_ui</Link>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content>
                                <HoverCard.Arrow />
                                <Stack gap="4" direction="row">
                                    <Avatar.Root>
                                        <Avatar.Image src="https://bit.ly/sage-adebayo" />
                                        <Avatar.Fallback name="Chakra UI" />
                                    </Avatar.Root>
                                    <Stack gap="3">
                                        <Stack gap="1">
                                            <Text textStyle="sm" fontWeight="semibold">
                                                Chakra UI
                                            </Text>
                                            <Text textStyle="sm" color="fg.muted">
                                                The most powerful toolkit for building modern web
                                                applications.
                                            </Text>
                                        </Stack>
                                        <HStack color="fg.subtle">
                                            <Icon size="sm">
                                                <LuChartLine />
                                            </Icon>
                                            <Text textStyle="xs">2.5M Downloads</Text>
                                        </HStack>
                                    </Stack>
                                </Stack>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            </Presenter>

            <Presenter title="Menu" link="https://chakra-ui.com/docs/components/menu">
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="outline" size="sm">
                            Open Menu
                        </Button>
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
            </Presenter>

            <Presenter
                title="Overlay Manager"
                link="https://chakra-ui.com/docs/components/overlay-manager"
            >
                <Button
                    onClick={() => {
                        dialog.open("a", {
                            title: "Dialog Title",
                            description: "Dialog Description"
                        });
                    }}
                >
                    Open Modal
                </Button>
                <dialog.Viewport />
            </Presenter>

            <Presenter title="Popover" link="https://chakra-ui.com/docs/components/popover">
                <HStack gap={2}>
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <Button size="sm" variant="outline">
                                Popover (Portal)
                            </Button>
                        </Popover.Trigger>
                        <Portal>
                            <Popover.Positioner>
                                <Popover.Content>
                                    <Popover.Arrow />
                                    <Popover.Body>
                                        <Popover.Title fontWeight="medium">
                                            Naruto Form
                                        </Popover.Title>
                                        <Text my="4">
                                            Naruto is a Japanese manga series written and
                                            illustrated by Masashi Kishimoto.
                                        </Text>
                                        <Input placeholder="Your fav. character" size="sm" />
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover.Positioner>
                        </Portal>
                    </Popover.Root>

                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <Button size="sm" variant="outline">
                                Popover (Without Portal)
                            </Button>
                        </Popover.Trigger>
                        <Popover.Positioner>
                            <Popover.Content>
                                <Popover.Arrow />
                                <Popover.Body>
                                    <Popover.Title fontWeight="medium">Naruto Form</Popover.Title>
                                    <Text my="4">
                                        Naruto is a Japanese manga series written and illustrated by
                                        Masashi Kishimoto.
                                    </Text>
                                    <Input placeholder="Your fav. character" size="sm" />
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Popover.Root>
                </HStack>
            </Presenter>

            <Presenter title="Toggle Tip" link="https://chakra-ui.com/docs/components/toggle-tip">
                <ToggleTip content="This is some additional information.">
                    <Button size="xs" variant="ghost">
                        <LuInfo />
                    </Button>
                </ToggleTip>
            </Presenter>

            <Presenter title="Tooltip" link="https://chakra-ui.com/docs/components/tooltip">
                <Tooltip content="This is the tooltip content">
                    <Button variant="outline" size="sm">
                        Hover for Tooltip
                    </Button>
                </Tooltip>
            </Presenter>
        </Box>
    );
}
