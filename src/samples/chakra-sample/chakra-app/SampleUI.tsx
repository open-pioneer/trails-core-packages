// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Button,
    Container,
    createToaster,
    Spinner,
    Stack,
    Text,
    Heading,
    Link,
    StackSeparator,
    Box,
    Toaster as ChakraToaster,
    CreateToasterReturn,
    Portal,
    Toast,
    useDisclosure,
    DrawerBackdrop,
    Alert,
    Accordion,
    Span,
    Dialog,
    Drawer,
    Popover
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Tooltip } from "@open-pioneer/chakra-snippets/tooltip";
import { Radio, RadioGroup } from "@open-pioneer/chakra-snippets/radio";
import { TableExampleComponent } from "./TableExample";
import { SelectComponent } from "./SelectExample";
import { CloseButton } from "@open-pioneer/chakra-snippets/close-button";

export function SampleUI() {
    const [toaster, toasterUI] = useToaster();
    return (
        <div style={{ overflow: "auto", height: "100%", width: "100%" }}>
            <Container>
                <Heading mb={5}>chakra technical demo</Heading>
                <LinkComponent></LinkComponent>
                <ComponentStack toaster={toaster}></ComponentStack>
                <TableExampleComponent />
                <SelectComponent />
                <AccordionDemo />
                <CloseButton></CloseButton>
            </Container>

            {toasterUI}
        </div>
    );
}

function LinkComponent() {
    return (
        <Text>
            This is a{" "}
            <Link href="https://chakra-ui.com" target="_blank">
                link to Chakra&apos;s Design system
            </Link>
        </Text>
    );
}

const ComponentStack = (props: { toaster: CreateToasterReturn }) => {
    return (
        <Stack mb={5} mt={5} separator={<StackSeparator />} gap="24px" align="stretch">
            <Box>
                <PortalExample />
            </Box>

            <Box>
                <TooltipExample />
            </Box>
            <Box>
                <TooltipExample />
            </Box>
            <Box>
                <TooltipExample />
            </Box>

            <Box>
                <ToastExample toaster={props.toaster} />
            </Box>
            <Box>
                <AlertExample />
            </Box>
            <Box>
                <DialogExample />
            </Box>
            <Box>
                <DrawerExample />
            </Box>
            <Box>
                <PopoverExample />
            </Box>
            <Box>
                <RadioGroupExample />
            </Box>
        </Stack>
    );
};

function PortalExample() {
    return (
        <Box bg="primary_background_secondary">
            <Heading size="sm">Portal Example: </Heading>
            This is box and displayed here. Scroll/Look down to see the portal that is added at the
            end of document.body. The Portal is part of this Box.
            <Portal >
                <Box className={"portal-content"}>This is the portal content!</Box>
            </Portal>
        </Box>
    );
}

function TooltipExample() {
    return (
        <Tooltip
            showArrow
            content="Button Tooltip"
            aria-label="A tooltip"
            positioning={{ placement: "top" }}
        >
            <Button>Button with a tooltip</Button>
        </Tooltip>
    );
}

const ToastExample = (props: { toaster: CreateToasterReturn }) => {
    return (
        <Button
            onClick={() => {
                props.toaster.create({
                    type: "loading",
                    description: "We've created your account for you.",
                    meta: {
                        closable: true
                    }
                });
            }}
        >
            Show Toast
        </Button>
    );
};

// Sketch for integration of chakra toaster.
// It needs the getRootNode function (-> #pioneer-root) to render correctly, so it
// cannot be created as a module-level constant.
// Use this as a base for the notifier package.
function useToaster() {
    const toaster = useMemo(
        () =>
            createToaster({
                placement: "bottom-end",
                pauseOnPageIdle: true
            }),
        []
    );

    const toasterUI = useMemo(
        () => (
            <Portal>
                <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
                    {(toast) => (
                        <Toast.Root width={{ md: "sm" }}>
                            {toast.type === "loading" ? (
                                <Spinner size="sm" color="blue.solid" />
                            ) : (
                                <Toast.Indicator />
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
                            {toast.meta?.closable && <Toast.CloseTrigger />}
                        </Toast.Root>
                    )}
                </ChakraToaster>
            </Portal>
        ),
        [toaster]
    );

    return [toaster, toasterUI] as const;
}

function AlertExample() {
    return (
        <Alert.Root status={"error"}>
            <Alert.Indicator></Alert.Indicator>
            <Alert.Content>
                <Alert.Title>Test Alert!</Alert.Title>
                <Alert.Description>This is a test alert (error)</Alert.Description>
            </Alert.Content>
        </Alert.Root>
    );
}

function DialogExample() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="outline">Open Me</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Dialog Title</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function DrawerExample() {
    const { open, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>Open Drawer</Button>
            <Drawer.Root open={open} placement="start" onOpenChange={onClose} size={"sm"}>
                <Portal>
                    <DrawerBackdrop></DrawerBackdrop>
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header>This is the drawer header</Drawer.Header>
                            <Drawer.Body>This is the body.</Drawer.Body>
                            <Drawer.Footer>
                                <Drawer.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Drawer.ActionTrigger>
                                <Button>Save</Button>
                            </Drawer.Footer>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </>
    );
}

const items = [
    { value: "first-item", title: "First Item", text: "Some value 1..." },
    { value: "second-item", title: "Second Item", text: "Some value 2..." },
    { value: "third-item", title: "Third Item", text: "Some value 3..." }
];

function PopoverExample() {
    return (
        <>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <Button>Show Popover rendered in an portal</Button>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content>
                            <Popover.Arrow />
                            <Popover.Header>Popover!</Popover.Header>
                            <Popover.Body>This Popover is rendered in Portal</Popover.Body>
                            <Popover.CloseTrigger />
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>

            <Popover.Root>
                <Popover.Trigger asChild>
                    <Button ml={5}>Show Popover without an portal</Button>
                </Popover.Trigger>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Header>Header</Popover.Header>
                        <Popover.CloseTrigger />
                        <Popover.Body>
                            This Popover is not portalled
                        </Popover.Body>
                        <Popover.Footer>This is the footer</Popover.Footer>
                    </Popover.Content>
                </Popover.Positioner>
            </Popover.Root>
        </>
    );
}

function RadioGroupExample() {
    const [value, setValue] = useState<string | null>("2");
    return (
        <>
            <RadioGroup onValueChange={(e) => setValue(e.value)} value={value} size="md">
                <Stack gap={4} direction="row">
                    <Radio value="1" disabled>
                        Radio 1 (Disabled)
                    </Radio>
                    <Radio value="2">Radio 2</Radio>
                    <Radio value="3">Radio 3</Radio>
                </Stack>
            </RadioGroup>
            <Text pt={1} fontStyle={"italic"}>
                {"Checked radio: " + value}
            </Text>

            <RadioGroup size="sm" mt={4}>
                <Stack gap={4} direction="row">
                    <Radio value="1" disabled>
                        Small Radio 1 (Disabled)
                    </Radio>
                    <Radio value="2">Small Radio 2</Radio>
                </Stack>
            </RadioGroup>
        </>
    );
}

const AccordionDemo = () => {
    const [value, setValue] = useState(["second-item"]);
    return (
        <Stack gap="4" p={2} mb={4} border={"solid"}>
            <Accordion.Root value={value} onValueChange={(e) => setValue(e.value)}>
                {items.map((item, index) => (
                    <Accordion.Item key={index} value={item.value}>
                        <Accordion.ItemTrigger>
                            <Span flex="1">{item.title}</Span>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>{item.text}</Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
            <Text fontStyle={"italic"}>Expanded item: {value.join(", ")}</Text>
        </Stack>
    );
};
