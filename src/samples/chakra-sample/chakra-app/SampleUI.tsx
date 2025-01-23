// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Toaster as ChakraToaster, CreateToasterReturn, Portal, Toast } from "@chakra-ui/react";
import {
    Button,
    Container,
    createToaster,
    Spinner,
    Stack,
    Text,
    useEnvironmentContext
} from "@open-pioneer/chakra-integration";
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

export function SampleUI() {
    const [toaster, toasterUI] = useToaster();
    return (
        <Container>
            {toasterUI}
            <Button onClick={(e) => console.log("Button clicked", e)}>Click me</Button>

            <Text>I am Text</Text>

            <AccordionDemo />
            <Spinner />

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

            <ToastExample toaster={toaster}></ToastExample>
        </Container>
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
