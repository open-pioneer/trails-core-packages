// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    AbsoluteCenter,
    AspectRatio,
    Badge,
    Bleed,
    Box,
    Center,
    Circle,
    Container,
    Flex,
    Float,
    Grid,
    GridItem,
    Group,
    Heading,
    ScrollArea,
    Separator,
    SimpleGrid,
    Stack,
    Text,
    Wrap
} from "@chakra-ui/react";
import {
    SplitterRoot,
    SplitterPanel,
    SplitterResizeTrigger
} from "@open-pioneer/chakra-snippets/splitter";
import { Presenter } from "../components/Presenter";

export function Layout() {
    const loremIpsum =
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. " +
        "Quisque faucibus ex sapien vitae pellentesque sem placerat. " +
        "In id cursus mi pretium tellus duis convallis. " +
        "Tempus leo eu aenean sed diam urna tempor. " +
        "Pulvinar vivamus fringilla lacus nec metus bibendum egestas. " +
        "Iaculis massa nisl malesuada lacinia integer nunc posuere. " +
        "Ut hendrerit semper vel class aptent taciti sociosqu. " +
        "Ad litora torquent per conubia nostra inceptos himenaeos.";

    return (
        <Box spaceY="4">
            <Presenter
                title="Aspect Ratio"
                link="https://chakra-ui.com/docs/components/aspect-ratio"
            >
                <AspectRatio bg="bg.muted" ratio={16 / 9}>
                    <Center fontSize="xl">16 / 9</Center>
                </AspectRatio>
            </Presenter>

            <Presenter title="Bleed" link="https://chakra-ui.com/docs/components/bleed">
                <Box padding="10" rounded="sm" borderWidth="1px">
                    <Bleed inline="10">
                        <Center height="20" bg="bg.emphasized">
                            Bleed
                        </Center>
                    </Bleed>

                    <Stack mt="6">
                        <Heading size="md">Some Heading</Heading>
                        <Text>{loremIpsum}</Text>
                    </Stack>
                </Box>
            </Presenter>

            <Presenter title="Box" link="https://chakra-ui.com/docs/components/box">
                <Box background="tomato" width="100%" padding="4" color="white">
                    This is the Box
                </Box>
            </Presenter>

            <Presenter
                title="Center (Absolute)"
                link="https://chakra-ui.com/docs/components/absolute-center"
            >
                <Box position="relative" h="100px" bg="bg.muted" borderRadius="md">
                    <AbsoluteCenter>
                        <Box bg="bg.emphasized" px="4" py="2" borderRadius="md" color="fg">
                            Centered Content
                        </Box>
                    </AbsoluteCenter>
                </Box>
            </Presenter>

            <Presenter title="Center" link="https://chakra-ui.com/docs/components/center">
                <Center bg="bg.emphasized" h="100px" maxW="320px">
                    <Box>This will be centered</Box>
                </Center>
            </Presenter>

            <Presenter title="Container" link="https://chakra-ui.com/docs/components/container">
                <Container>
                    <Box px="2">{loremIpsum}</Box>
                </Container>
            </Presenter>

            <Presenter title="Flex" link="https://chakra-ui.com/docs/components/flex">
                <Flex gap="4">
                    <Center h="20" w="40" bg="bg.emphasized">
                        A
                    </Center>
                    <Center h="20" w="40" bg="bg.emphasized">
                        B
                    </Center>
                    <Center h="20" w="40" bg="bg.emphasized">
                        C
                    </Center>
                </Flex>
            </Presenter>

            <Presenter title="Float" link="https://chakra-ui.com/docs/components/float">
                <Box position="relative" w="80px" h="80px" bg="bg.emphasized">
                    <Float>
                        <Circle size="5" bg="red" color="white">
                            3
                        </Circle>
                    </Float>
                </Box>
            </Presenter>

            <Presenter title="Grid" link="https://chakra-ui.com/docs/components/grid">
                <Grid templateColumns="repeat(4, 1fr)" gap="6">
                    <GridItem colSpan={2}>
                        <Center h="20" bg="bg.emphasized">
                            A
                        </Center>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Center h="20" bg="bg.emphasized">
                            B
                        </Center>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Center h="20" bg="bg.emphasized">
                            C
                        </Center>
                    </GridItem>
                </Grid>
            </Presenter>

            <Presenter title="Group" link="https://chakra-ui.com/docs/components/group">
                <Group>
                    <Center h="20" w="40" bg="bg.emphasized">
                        1
                    </Center>
                    <Center h="20" w="40" bg="bg.emphasized">
                        2
                    </Center>
                </Group>
            </Presenter>

            <Presenter title="Scroll Area" link="https://chakra-ui.com/docs/components/scroll-area">
                <ScrollArea.Root
                    height="8.5rem"
                    maxW="lg"
                    borderColor="border.disabled"
                    color="fg.disabled"
                >
                    <ScrollArea.Viewport>
                        <ScrollArea.Content spaceY="4" textStyle="sm">
                            <p>{loremIpsum}</p>
                            <p>{loremIpsum}</p>
                            <p>{loremIpsum}</p>
                        </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar>
                        <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner />
                </ScrollArea.Root>
            </Presenter>

            <Presenter title="Separator" link="https://chakra-ui.com/docs/components/separator">
                <Stack borderColor="border.disabled" color="fg.disabled">
                    <Text>First</Text>
                    <Separator />
                    <Text>Second</Text>
                    <Separator />
                    <Text>Third</Text>
                </Stack>
            </Presenter>

            <Presenter title="Simple Grid" link="https://chakra-ui.com/docs/components/simple-grid">
                <SimpleGrid columns={2} gap="40px">
                    <Box height="20" bg="bg.emphasized" />
                    <Box height="20" bg="bg.emphasized" />
                    <Box height="20" bg="bg.emphasized" />
                    <Box height="20" bg="bg.emphasized" />
                </SimpleGrid>
            </Presenter>

            <Presenter title="Splitter" link="https://chakra-ui.com/docs/components/splitter">
                <SplitterRoot panels={[{ id: "a" }, { id: "b" }]} borderWidth="1px" minH="60">
                    <SplitterPanel id="a">
                        <Center boxSize="full" textStyle="2xl">
                            A
                        </Center>
                    </SplitterPanel>
                    <SplitterResizeTrigger id="a:b" />
                    <SplitterPanel id="b">
                        <Center boxSize="full" textStyle="2xl">
                            B
                        </Center>
                    </SplitterPanel>
                </SplitterRoot>
            </Presenter>

            <Presenter title="Stack" link="https://chakra-ui.com/docs/components/stack">
                <Stack>
                    <Box h="20" bg="bg.emphasized" />
                    <Box h="20" bg="bg.emphasized" />
                    <Box h="20" bg="bg.emphasized" />
                </Stack>
            </Presenter>

            <Presenter title="Wrap" link="https://chakra-ui.com/docs/components/wrap">
                <Wrap>
                    <Badge>Badge 1</Badge>
                    <Badge>Badge 2</Badge>
                    <Badge>Badge 3</Badge>
                </Wrap>
            </Presenter>
        </Box>
    );
}
