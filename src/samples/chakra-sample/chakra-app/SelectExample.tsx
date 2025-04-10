// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createListCollection, Spinner, Text } from "@chakra-ui/react";
import { NativeSelect } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";

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
            <NativeSelect.Root mb={4}>
                <NativeSelect.Field placeholder="Select an item">
                    <option value="item1">Item 1</option>
                    <option value="item2">Item 2</option>
                    <option value="item3">Item 3</option>
                </NativeSelect.Field>
            </NativeSelect.Root>

            <Select.Root collection={frameworks} size="sm" width="320px" mb={4}>
                <Select.Label>New select component</Select.Label>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select an item" />
                </Select.Trigger>
                <Select.Content>
                    {frameworks.items.map((item) => (
                        <Select.Item item={item} key={item.value} justifyContent="flex-start">
                            {item.label}
                            <Spinner />
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </>
    );
}
