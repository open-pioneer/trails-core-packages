// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    Container,
    createListCollection,
    Flex,
    Group,
    Input,
    InputAddon,
    Link,
    Menu,
    NativeSelectField,
    Portal,
    Select,
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
import { SectionHeading, TitledSection } from "@open-pioneer/react-utils";
import { Children, cloneElement, isValidElement, ReactNode } from "react";

export function AppUI() {
    return (
        <Container centerContent={true}>
            <TitledSection
                title='Demo page based on color scheme "trails"'
                sectionHeadingProps={{ size: "md", py: 2 }}
            >
                <Flex justifyContent={"center"}>
                    <Pane>
                        <ButtonSection />
                        <CheckboxSection />
                        <InputSection />
                    </Pane>
                    <Pane>
                        <LinkSection />
                        <RadioSection />
                        <SelectSection />
                        <NativeSelectSection />
                        <SliderSection />
                        <SwitchSection />
                        <TextAreaSection />
                        <MenuSection />
                    </Pane>
                </Flex>
            </TitledSection>
        </Container>
    );
}

function Pane(props: { children: ReactNode }) {
    const children = Children.toArray(props.children);

    const separatedChildren: ReactNode[] = [];
    for (const [index, child] of children.entries()) {
        if (index > 0) {
            separatedChildren.push(<Separator key={`sep-${index}`} my={5} />);
        }
        if (isValidElement(child)) {
            separatedChildren.push(cloneElement(child, { key: `child-${index}` }));
        }
    }

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            padding={2}
            boxShadow="lg"
            margin={3}
            minW={"400px"}
        >
            {separatedChildren}
        </Box>
    );
}

function Section(props: { heading: string; children: ReactNode }) {
    const { heading, children } = props;
    return (
        <TitledSection>
            <SectionHeading size="sm">{heading}</SectionHeading>
            <Stack direction="column" alignItems="start" my={2}>
                {children}
            </Stack>
        </TitledSection>
    );
}

function ButtonSection() {
    return (
        <Section heading="Button">
            <TitledSection>
                <SectionHeading size="xs">default with tooltip</SectionHeading>
                <Tooltip content="Default button" openDelay={500}>
                    <Button>default</Button>
                </Tooltip>
            </TitledSection>
            <TitledSection>
                <SectionHeading size="xs">Chakra UI variants</SectionHeading>
                <Stack direction="row">
                    <Button variant="solid">solid</Button>
                    <Button variant="outline">outline</Button>
                    <Button variant="ghost">ghost</Button>
                    <Button variant="surface">surface</Button>
                    <Button variant="plain">plain</Button>
                </Stack>
            </TitledSection>
            <TitledSection>
                <SectionHeading size={"xs"}>colorPalette</SectionHeading>
                <Stack direction="row">
                    <Button colorPalette="blue">blue</Button>
                    <Button colorPalette="red">red</Button>
                    <Button colorPalette="green">green</Button>
                </Stack>
            </TitledSection>
            <TitledSection>
                <SectionHeading size={"xs"}>Button states</SectionHeading>
                <Stack direction="row">
                    <Button disabled>disabled</Button>
                    <Button loading>loading</Button>
                    <Button loading loadingText="loading...">
                        loading with text
                    </Button>
                </Stack>
            </TitledSection>
        </Section>
    );
}

function CheckboxSection() {
    return (
        <Section heading="Checkbox">
            <Checkbox defaultChecked>defaultChecked1</Checkbox>
            <Checkbox defaultChecked>defaultChecked2</Checkbox>
            <Checkbox disabled>disabled</Checkbox>
            <Checkbox invalid>invalid</Checkbox>
        </Section>
    );
}

function InputSection() {
    return (
        <Section heading="Input" key="input">
            <Field invalid={false}>
                <Input placeholder="outline (default)"></Input>
            </Field>

            <Input variant={"subtle"} placeholder="subtle"></Input>
            <Group attached>
                <InputAddon></InputAddon>
                <Input placeholder="input with left addon" />
            </Group>
        </Section>
    );
}

function LinkSection() {
    return (
        <Section heading="Link">
            <Link href="https://github.com/open-pioneer" target="_blank">
                https://github.com/open-pioneer
            </Link>
        </Section>
    );
}

function RadioSection() {
    return (
        <Section heading="Radio">
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
        </Section>
    );
}

function SelectSection() {
    const frameworks = createListCollection({
        items: [
            { label: "React.js", value: "react" },
            { label: "Vue.js", value: "vue" },
            { label: "Angular", value: "angular" },
            { label: "Svelte", value: "svelte" }
        ]
    });

    return (
        <Section heading="Select">
            <Select.Root collection={frameworks} size="sm" width="320px">
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select framework" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {frameworks.items.map((framework) => (
                                <Select.Item item={framework} key={framework.value}>
                                    {framework.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            <Select.Root disabled collection={frameworks} size="sm" width="320px">
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Select framework" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {frameworks.items.map((framework) => (
                                <Select.Item item={framework} key={framework.value}>
                                    {framework.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
        </Section>
    );
}

function NativeSelectSection() {
    return (
        <Section heading="Native Select">
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
        </Section>
    );
}

function SliderSection() {
    return (
        <Section heading="Slider">
            <Slider defaultValue={[30]} w="200px"></Slider>
        </Section>
    );
}

function SwitchSection() {
    return (
        <Section heading="Switch">
            <Switch defaultChecked />
        </Section>
    );
}

function TextAreaSection() {
    return (
        <Section heading="Textarea">
            <Textarea placeholder="Here is a sample placeholder" />
        </Section>
    );
}

function MenuSection() {
    return (
        <Section heading="Menu">
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button variant="outline" size="sm">
                        Open
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
        </Section>
    );
}
