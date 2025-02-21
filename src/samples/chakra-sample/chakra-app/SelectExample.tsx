// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createListCollection, Spinner, Text } from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "./snippets/native-select";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "./snippets/select";

const frameworks = createListCollection({
    items: [
        { label: "option 1", value: "option1" },
        { label: "option 2", value: "option2" },
        { label: "option 3", value: "option3" },
        { label: "option 4", value: "option4" }
    ]
});

export function SelectComponent() {
    return (
        <>
            <Text fontSize={"sm"} fontWeight={500} mt={4} mb={1}>
                Native select component
            </Text>
            <NativeSelectRoot mb={4}>
                <NativeSelectField placeholder="Select an item">
                    <option value="item1">Item 1</option>
                    <option value="item2">Item 2</option>
                    <option value="item3">Item 3</option>
                </NativeSelectField>
            </NativeSelectRoot>

            <SelectRoot collection={frameworks} size="sm" width="320px" mb={4}>
                <SelectLabel>New select component</SelectLabel>
                <SelectTrigger>
                    <SelectValueText placeholder="Selct an item" />
                </SelectTrigger>
                <SelectContent>
                    {frameworks.items.map((item) => (
                        <SelectItem item={item} key={item.value} justifyContent="flex-start">
                            {item.label}
                            <Spinner />
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        </>
    );
}
