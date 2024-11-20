// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Button,
    Container,
    Spinner,
    Stack,
    Text
} from "@open-pioneer/chakra-integration";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "./snippets/accordion";
import { useState } from "react";

export function SampleUI() {
    return (
        <Container>
            <Button onClick={(e) => console.log("Button clicked", e)}>Click me</Button>

            <Text>I am Text</Text>

            <AccordionDemo />
            <Spinner />
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

const items = [
    { value: "first-item", title: "First Item", text: "Some value 1..." },
    { value: "second-item", title: "Second Item", text: "Some value 2..." },
    { value: "third-item", title: "Third Item", text: "Some value 3..." }
];
