// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    Container,
    Flex,
    Group,
    Heading,
    Input,
    InputAddon,
    Link,
    NativeSelectField,
    Separator,
    Stack,
    Textarea
} from "@chakra-ui/react";
import { Checkbox } from "@open-pioneer/chakra-snippets/checkbox";
import { Field } from "@open-pioneer/chakra-snippets/field";
import { NativeSelectRoot } from "@open-pioneer/chakra-snippets/native-select";
import { Radio, RadioGroup } from "@open-pioneer/chakra-snippets/radio";
import { Slider } from "@open-pioneer/chakra-snippets/slider";
import { Switch } from "@open-pioneer/chakra-snippets/switch";
import { Tooltip } from "@open-pioneer/chakra-snippets/tooltip";

export function AppUI() {
    return (
        <Container centerContent={true}>
            <Heading size={"md"} py={2}>
                Demo page based on color scheme &quot;trails&quot;
            </Heading>
            <Flex justifyContent={"center"}>
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={2}
                    boxShadow="lg"
                    margin={3}
                    minW={"400px"}
                >
                    <Heading size={"md"}>Button</Heading>
                    <Heading size={"xs"}>default with tooltip</Heading>
                    <Stack direction="row" my={2}>
                        <Tooltip
                            content="Default button"
                            lazyMount={true}
                            unmountOnExit={true}
                            openDelay={500}
                        >
                            <Button>default</Button>
                        </Tooltip>
                    </Stack>

                    <Heading size={"xs"}>Chakra UI variants</Heading>
                    <Stack direction="row" my={2}>
                        <Button variant="solid">solid</Button>
                        <Button variant="outline">outline</Button>
                        <Button variant="ghost">ghost</Button>
                        <Button variant="surface">surface</Button>
                        <Button variant="plain">plain</Button>
                    </Stack>

                    <Heading size={"xs"}>Button states</Heading>
                    <Stack direction="row" my={2}>
                        <Button disabled>disabled</Button>
                        <Button loading>loading</Button>
                        <Button loading loadingText="loading...">
                            loading with text
                        </Button>
                    </Stack>

                    <Heading size={"xs"}>colorPalette</Heading>
                    <Stack direction="row" my={2}>
                        <Button colorPalette="blue">blue</Button>
                        <Button colorPalette="red">red</Button>
                    </Stack>

                    <Separator my={5} />

                    <Heading size={"md"}>Checkbox</Heading>
                    <Stack direction="column" my={2} gap={1}>
                        <Checkbox defaultChecked>defaultChecked1</Checkbox>
                        <Checkbox defaultChecked>defaultChecked2</Checkbox>
                        <Checkbox disabled>disabled</Checkbox>
                        <Checkbox invalid>invalid</Checkbox>
                    </Stack>

                    <Separator my={5} />

                    <Heading size={"md"}>Input</Heading>
                    <Stack direction="column" my={2}>
                        <Field invalid={false}>
                            <Input placeholder="outline (default)"></Input>
                        </Field>

                        <Input variant={"subtle"} placeholder="subtle"></Input>
                        <Group attached>
                            <InputAddon></InputAddon>
                            <Input placeholder="input with left addon" />
                        </Group>
                    </Stack>
                </Box>
                <Box
                    bg="white"
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={2}
                    boxShadow="lg"
                    margin={3}
                    minW={"400px"}
                >
                    <Heading size={"md"}>Link</Heading>
                    <Stack direction="column" my={2}>
                        <Link href="https://github.com/open-pioneer" target="_blank">
                            https://github.com/open-pioneer
                        </Link>
                    </Stack>

                    <Separator my={5} />

                    <Heading size={"md"}>Radio</Heading>
                    <RadioGroup defaultValue={"0"}>
                        <Stack direction="column" my={2} gap={1}>
                            <Radio value="0">defaultChecked</Radio>
                            <Radio disabled value="1">
                                disabled
                            </Radio>
                            <Radio invalid value="2">
                                invalid
                            </Radio>
                        </Stack>
                    </RadioGroup>

                    <Separator my={5} />

                    <Heading size={"md"}>Select</Heading>
                    <Stack direction="column" my={2}>
                        <NativeSelectRoot variant={"outline"}>
                            <NativeSelectField>
                                <option value="option1">outline1 (default)</option>
                                <option value="option2">outline2 (default)</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                        <NativeSelectRoot variant={"subtle"}>
                            <NativeSelectField>
                                <option value="option1">subtle1</option>
                                <option value="option2">subtle2</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                        <NativeSelectRoot disabled>
                            <NativeSelectField>
                                <option value="option1">disabled</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                    </Stack>

                    <Separator my={5} />

                    <Heading size={"md"}>Slider</Heading>
                    <Stack direction="column" my={2}>
                        <Slider defaultValue={[30]}></Slider>
                    </Stack>

                    <Separator my={5} />

                    <Heading size={"md"}>Switch</Heading>
                    <Stack direction="column" my={2}>
                        <Switch defaultChecked/>
                    </Stack>

                    <Separator my={5} />

                    <Heading size={"md"}>Textarea</Heading>
                    <Stack direction="column" my={2}>
                        <Textarea placeholder="Here is a sample placeholder" />
                    </Stack>
                </Box>
            </Flex>
        </Container>
    );
}
