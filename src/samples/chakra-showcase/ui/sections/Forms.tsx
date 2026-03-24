// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    Center,
    CheckboxCard,
    ColorPicker,
    ColorSwatch,
    Editable,
    Field,
    Fieldset,
    FileUpload,
    For,
    HStack,
    Input,
    InputGroup,
    NativeSelect,
    NumberInput,
    parseColor,
    PinInput,
    Portal,
    RadioCard,
    RadioGroup,
    RatingGroup,
    SegmentGroup,
    Span,
    Stack,
    TagsInput,
    Textarea,
    VStack
} from "@chakra-ui/react";
import { Checkbox as CheckboxSnippet } from "@open-pioneer/chakra-snippets/checkbox";
import { Slider } from "@open-pioneer/chakra-snippets/slider";
import {
    RadioGroup as RadioGroupSnippet,
    Radio as RadioSnippet
} from "@open-pioneer/chakra-snippets/radio";
import { Switch as SwitchSnippet } from "@open-pioneer/chakra-snippets/switch";
import { PasswordInput } from "@open-pioneer/chakra-snippets/password-input";
import { Presenter } from "../components/Presenter";

export function Forms() {
    const frameworks = [
        { value: "next", title: "Next.js" },
        { value: "remix", title: "Remix" },
        { value: "vite", title: "Vite" },
        { value: "astro", title: "Astro" }
    ];

    return (
        <Box display="flex" flexDirection="column" gap="4" alignItems="flex-start">
            <Presenter title="Checkbox" link="https://chakra-ui.com/docs/components/checkbox">
                <VStack alignItems="start">
                    <CheckboxSnippet>Accept terms and conditions</CheckboxSnippet>
                    <CheckboxSnippet disabled>disabled</CheckboxSnippet>
                    <CheckboxSnippet invalid>invalid</CheckboxSnippet>
                    <CheckboxSnippet readOnly={true}>readOnly</CheckboxSnippet>
                </VStack>
            </Presenter>

            <Presenter
                title="Checkbox Card"
                link="https://chakra-ui.com/docs/components/checkbox-card"
            >
                <CheckboxCard.Root maxW="240px">
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control>
                        <CheckboxCard.Label>Next.js</CheckboxCard.Label>
                        <CheckboxCard.Indicator />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
            </Presenter>

            <Presenter
                title="Color Picker"
                link="https://chakra-ui.com/docs/components/color-picker"
            >
                <ColorPicker.Root defaultValue={parseColor("#6cc24a")} maxW="200px">
                    <ColorPicker.HiddenInput />
                    <ColorPicker.Label>Color</ColorPicker.Label>
                    <ColorPicker.Control>
                        <ColorPicker.Input />
                        <ColorPicker.Trigger />
                    </ColorPicker.Control>
                    <Portal>
                        <ColorPicker.Positioner>
                            <ColorPicker.Content>
                                <ColorPicker.Area />
                                <HStack>
                                    <ColorPicker.EyeDropper size="xs" variant="outline" />
                                    <ColorPicker.Sliders />
                                </HStack>
                            </ColorPicker.Content>
                        </ColorPicker.Positioner>
                    </Portal>
                </ColorPicker.Root>
            </Presenter>

            <Presenter
                title="Color Swatch"
                link="https://chakra-ui.com/docs/components/color-swatch"
            >
                <ColorSwatch value="#bada55" size={"2xl"} />
            </Presenter>

            <Presenter title="Editable" link="https://chakra-ui.com/docs/components/editable">
                <Editable.Root textAlign="start" defaultValue="Click to edit text">
                    <Editable.Preview />
                    <Editable.Input />
                </Editable.Root>
            </Presenter>

            <Presenter title="Field" link="https://chakra-ui.com/docs/components/field">
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input placeholder="me@example.com" />
                </Field.Root>
            </Presenter>

            <Presenter title="Fieldset" link="https://chakra-ui.com/docs/components/fieldset">
                <Fieldset.Root size="lg" maxW="md">
                    <Stack>
                        <Fieldset.Legend>Contact details</Fieldset.Legend>
                        <Fieldset.HelperText>
                            Please provide your contact details below.
                        </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root>
                            <Field.Label>Name</Field.Label>
                            <Input name="name" />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Email address</Field.Label>
                            <Input name="email" type="email" />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Country</Field.Label>
                            <NativeSelect.Root>
                                <NativeSelect.Field name="country">
                                    <For each={["Austria", "Germany", "Switzerland"]}>
                                        {(item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        )}
                                    </For>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        </Field.Root>
                    </Fieldset.Content>

                    <Button type="submit" alignSelf="flex-start">
                        Submit
                    </Button>
                </Fieldset.Root>
            </Presenter>

            <Presenter title="File Upload" link="https://chakra-ui.com/docs/components/file-upload">
                <FileUpload.Root>
                    <FileUpload.HiddenInput />
                    <FileUpload.Trigger asChild>
                        <Button variant="outline" size="sm">
                            Upload file
                        </Button>
                    </FileUpload.Trigger>
                    <FileUpload.List />
                </FileUpload.Root>
            </Presenter>

            <Presenter title="Input" link="https://chakra-ui.com/docs/components/input">
                <VStack alignItems="start">
                    <Input placeholder="Enter your email" />
                    <Input variant={"subtle"} placeholder="subtle" />
                    <Input readOnly={true} value={"readOnly-Text"} />
                    <InputGroup w="full" startAddon="https://">
                        <Input placeholder="yoursite.com" />
                    </InputGroup>
                </VStack>
            </Presenter>

            <Presenter
                title="Number Input"
                link="https://chakra-ui.com/docs/components/number-input"
            >
                <NumberInput.Root defaultValue="10" width="200px">
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
            </Presenter>

            <Presenter
                title="Password Input"
                link="https://chakra-ui.com/docs/components/password-input"
            >
                <PasswordInput />
            </Presenter>

            <Presenter title="Pin Input" link="https://chakra-ui.com/docs/components/pin-input">
                <PinInput.Root>
                    <PinInput.HiddenInput />
                    <PinInput.Control>
                        <PinInput.Input index={0} />
                        <PinInput.Input index={1} />
                        <PinInput.Input index={2} />
                        <PinInput.Input index={3} />
                    </PinInput.Control>
                </PinInput.Root>
            </Presenter>

            <Presenter title="Radio Card" link="https://chakra-ui.com/docs/components/radio-card">
                <RadioCard.Root defaultValue="next">
                    <RadioCard.Label>Select framework</RadioCard.Label>
                    <HStack align="stretch">
                        {frameworks.map((item) => (
                            <RadioCard.Item key={item.value} value={item.value}>
                                <RadioCard.ItemHiddenInput />
                                <RadioCard.ItemControl>
                                    <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                                    <RadioCard.ItemIndicator />
                                </RadioCard.ItemControl>
                            </RadioCard.Item>
                        ))}
                    </HStack>
                </RadioCard.Root>
            </Presenter>

            <Presenter title="Radio" link="https://chakra-ui.com/docs/components/radio">
                <VStack gap={4} alignItems="start">
                    <RadioGroup.Root defaultValue="next">
                        <Center>Select Framework</Center>
                        <HStack gap="6">
                            {frameworks.map((item) => (
                                <RadioGroup.Item key={item.value} value={item.value}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>{item.title}</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            ))}
                        </HStack>
                    </RadioGroup.Root>

                    <RadioGroupSnippet defaultValue={"0"}>
                        <Center>States</Center>
                        <HStack gap={6}>
                            <RadioSnippet value="0">defaultChecked</RadioSnippet>
                            <RadioSnippet disabled value="1">
                                disabled
                            </RadioSnippet>
                            <RadioSnippet invalid value="2">
                                invalid
                            </RadioSnippet>
                        </HStack>
                    </RadioGroupSnippet>
                </VStack>
            </Presenter>

            <Presenter title="Rating" link="https://chakra-ui.com/docs/components/rating">
                <RatingGroup.Root count={5} defaultValue={3} size="sm">
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control />
                </RatingGroup.Root>
            </Presenter>

            <Presenter
                title="Segmented Control"
                link="https://chakra-ui.com/docs/components/segmented-control"
            >
                <SegmentGroup.Root defaultValue="React">
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items items={["React", "Vue", "Solid"]} />
                </SegmentGroup.Root>
            </Presenter>

            <Presenter
                title="Select (Native)"
                link="https://chakra-ui.com/docs/components/native-select"
            >
                <VStack alignItems="start">
                    <NativeSelect.Root size="sm" width="240px">
                        <NativeSelect.Field placeholder="Select option">
                            <option value="react">React</option>
                            <option value="vue">Vue</option>
                            <option value="angular">Angular</option>
                            <option value="svelte">Svelte</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <NativeSelect.Root size="sm" width="240px" disabled>
                        <NativeSelect.Field placeholder="Select option (disabled)">
                            <option value="react">disabled</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </VStack>
            </Presenter>

            <Presenter title="Switch" link="https://chakra-ui.com/docs/components/switch">
                <VStack alignItems="start">
                    <SwitchSnippet defaultChecked>Activate Chakra</SwitchSnippet>
                    <SwitchSnippet readOnly>Readonly</SwitchSnippet>
                    <SwitchSnippet disabled>Disabled</SwitchSnippet>
                </VStack>
            </Presenter>

            <Presenter title="Slider" link="https://chakra-ui.com/docs/components/slider">
                <VStack alignItems="left">
                    <Slider label="Select quantity" defaultValue={[30]} w="200px" />
                    <Slider label="Disabled slider" disabled={true} defaultValue={[30]} w="200px" />
                </VStack>
            </Presenter>

            <Presenter title="Textarea" link="https://chakra-ui.com/docs/components/textarea">
                <Textarea placeholder="Comment..." />
            </Presenter>

            <Presenter title="Tags Input" link="https://chakra-ui.com/docs/components/tags-input">
                <TagsInput.Root defaultValue={["React", "Chakra", "TypeScript"]}>
                    <TagsInput.Label>Tags</TagsInput.Label>
                    <TagsInput.Control>
                        <TagsInput.Items />
                        <TagsInput.Input placeholder="Add tag..." />
                    </TagsInput.Control>
                    <Span textStyle="xs" color="fg.muted" ms="auto">
                        Press Enter or Return to add tag
                    </Span>
                </TagsInput.Root>
            </Presenter>
        </Box>
    );
}
