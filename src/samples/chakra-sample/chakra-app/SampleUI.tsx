// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
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
    useEnvironmentContext,
    useDisclosure,
    DrawerBackdrop
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot
} from "./snippets/accordion";
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from "./snippets/dialog";
import { Tooltip } from "./snippets/tooltip";
import { Alert } from "./snippets/alert";
import {
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerActionTrigger,
    DrawerCloseTrigger
} from "./snippets/drawer";

export function SampleUI() {
    const [toaster, toasterUI] = useToaster();
    return (
        <div style={{ overflow: "auto", height: "100%", width: "100%" }}>
            <Container>
                <Heading mb={5}>chakra technical demo</Heading>
                <LinkComponent></LinkComponent>
                <ComponentStack toaster={toaster}></ComponentStack>
                {toasterUI}
                <Button onClick={(e) => console.log("Button clicked", e)}>Click me</Button>

                <Text>I am Text</Text>

                <AccordionDemo />
                <Spinner />
            </Container>
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
            {/*<Box>
                <PopoverExample />
            </Box>
            <Box>
                <RadioGroupExample />
            </Box> */}
        </Stack>
    );
};

function PortalExample() {
    return (
        <Box bg="background_secondary">
            <Heading size="sm">Portal Example: </Heading>
            This is box and displayed here. Scroll/Look down to see the portal that is added at the
            end of document.body. The Portal is part of this Box.
            <Portal>
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
            lazyMount={true}
            unmountOnExit={true}
        >
            <Button>Button with a tooltip</Button>
        </Tooltip>
    );
}

const AccordionDemo = () => {
    const [value, setValue] = useState(["second-item"]);
    return (
        <Stack gap="4">
            <Text fontWeight="medium">Expanded: {value.join(", ")}</Text>
            <AccordionRoot value={value} onValueChange={(e) => setValue(e.value)}>
                {items.map((item, index) => (
                    <AccordionItem key={index} value={item.value}>
                        <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
                        <AccordionItemContent>{item.text}</AccordionItemContent>
                    </AccordionItem>
                ))}
            </AccordionRoot>
        </Stack>
    );
};

const ToastExample = (props: { toaster: CreateToasterReturn }) => {
    return (
        <Button
            onClick={() => {
                props.toaster.create({
                    type: "loading",
                    description: "We've created your account for you."
                });
            }}
        >
            Show Toast
        </Button>
    );
};

function AlertExample() {
    return (
        <Alert status="error" title={"Test Alert!"}>
            This is a test alert (error)
        </Alert>
    );
}

function DialogExample() {
    return (
        <DialogRoot>
            <DialogTrigger asChild>
                <Button variant="outline">Open Me</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button>Save</Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}

function DrawerExample() {
    const { open, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>Open Drawer</Button>
            <DrawerRoot open={open} placement="start" onOpenChange={onClose} size={"sm"}>
                <DrawerBackdrop></DrawerBackdrop>
                <DrawerContent>
                    <DrawerHeader>This is the drawer header</DrawerHeader>

                    <DrawerBody>This is the body.</DrawerBody>

                    <DrawerFooter>
                        <DrawerActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerActionTrigger>
                        <Button>Save</Button>
                    </DrawerFooter>
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>
        </>
    );
}

const items = [
    { value: "first-item", title: "First Item", text: "Some value 1..." },
    { value: "second-item", title: "Second Item", text: "Some value 2..." },
    { value: "third-item", title: "Third Item", text: "Some value 3..." }
];

// Sketch for integration of chakra toaster.
// It needs the getRootNode function (-> #pioneer-root) to render correctly, so it
// cannot be created as a module-level constant.
// Use this as a base for the notifier package.
function useToaster() {
    const { getRootNode } = useEnvironmentContext();
    const toaster = useMemo(
        () =>
            createToaster({
                placement: "bottom-end",
                pauseOnPageIdle: true,
                getRootNode
            }),
        [getRootNode]
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
