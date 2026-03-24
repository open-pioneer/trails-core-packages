// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Center, Heading, Tabs, VStack } from "@chakra-ui/react";
import { Notifier } from "@open-pioneer/notifier";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import { Buttons } from "./sections/Buttons";
import { Collections } from "./sections/Collections";
import { DataDisplay } from "./sections/DataDisplay";
import { DateTime } from "./sections/DateTime";
import { Disclosure } from "./sections/Disclosure";
import { Feedback } from "./sections/Feedback";
import { Forms } from "./sections/Forms";
import { Layout } from "./sections/Layout";
import { Overlays } from "./sections/Overlays";
import { Theming } from "./sections/Theming";
import { Typography } from "./sections/Typography";
import { Utilities } from "./sections/Utilities";

export function AppUI() {
    return (
        <Center h="full">
            <Notifier />
            <VStack h="full" overflow={"hidden"}>
                <Heading my="4">Chakra UI Showcase</Heading>
                <ColorModeSwitcher />
                <Tabs.Root
                    defaultValue="layout"
                    variant={"line"}
                    h="100%"
                    display={"flex"}
                    flexDirection={"column"}
                    maxWidth={"60em"}
                    borderWidth={"1px"}
                    p="4"
                    borderColor="border.disabled"
                    color="fg.disabled"
                    lazyMount
                    unmountOnExit
                >
                    <Tabs.List mx="-4" textWrap="nowrap">
                        <Tabs.Trigger value="layout">Layout</Tabs.Trigger>
                        <Tabs.Trigger value="theming">Theming</Tabs.Trigger>
                        <Tabs.Trigger value="typography">Typography</Tabs.Trigger>
                        <Tabs.Trigger value="buttons">Buttons</Tabs.Trigger>
                        <Tabs.Trigger value="datetime">Date and Time</Tabs.Trigger>
                        <Tabs.Trigger value="forms">Forms</Tabs.Trigger>
                        <Tabs.Trigger value="collections">Collections</Tabs.Trigger>
                        <Tabs.Trigger value="overlays">Overlays</Tabs.Trigger>
                        <Tabs.Trigger value="disclosure">Disclosure</Tabs.Trigger>
                        <Tabs.Trigger value="feedback">Feedback</Tabs.Trigger>
                        <Tabs.Trigger value="dataDisplay">Data Display</Tabs.Trigger>
                        <Tabs.Trigger value="utilities">Utilities</Tabs.Trigger>
                    </Tabs.List>
                    <Box flex={"1"} minH="0" overflow={"auto"} pe={2}>
                        <Tabs.Content value="layout">
                            <Layout />
                        </Tabs.Content>
                        <Tabs.Content value="theming">
                            <Theming />
                        </Tabs.Content>
                        <Tabs.Content value="typography">
                            <Typography />
                        </Tabs.Content>
                        <Tabs.Content value="buttons">
                            <Buttons />
                        </Tabs.Content>
                        <Tabs.Content value="datetime">
                            <DateTime />
                        </Tabs.Content>
                        <Tabs.Content value="forms">
                            <Forms />
                        </Tabs.Content>
                        <Tabs.Content value="collections">
                            <Collections />
                        </Tabs.Content>
                        <Tabs.Content value="overlays">
                            <Overlays />
                        </Tabs.Content>
                        <Tabs.Content value="disclosure">
                            <Disclosure />
                        </Tabs.Content>
                        <Tabs.Content value="feedback">
                            <Feedback />
                        </Tabs.Content>
                        <Tabs.Content value="dataDisplay">
                            <DataDisplay />
                        </Tabs.Content>
                        <Tabs.Content value="utilities">
                            <Utilities />
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </VStack>
        </Center>
    );
}
