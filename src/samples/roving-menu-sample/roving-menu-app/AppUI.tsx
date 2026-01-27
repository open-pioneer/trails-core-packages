// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    Code,
    Container,
    Heading,
    HStack,
    List,
    Text,
    VStack
} from "@chakra-ui/react";
import { RovingMenuRoot, useRovingMenu, useRovingMenuItem } from "@open-pioneer/react-utils";

export function AppUI() {
    return (
        <Container maxWidth="2xl" p={5}>
            <VStack gap={10} align="stretch">
                <VStack gap={2} align="start">
                    <Heading size="xl" mb={4}>
                        Roving Menu Sample
                    </Heading>
                    <Text>
                        This sample demonstrates keyboard navigation using the roving tabindex
                        pattern. Focus management allows users to navigate through menu items using
                        arrow keys.
                    </Text>
                    <List.Root pl={4}>
                        <List.Item>
                            Users can tab into the menus and use arrows keys within a menu.
                        </List.Item>
                        <List.Item>Arrow key navigation wraps around.</List.Item>

                        <List.Item>
                            The last focused button is restored when switching between the menus.
                        </List.Item>
                        <List.Item>
                            Only one button in each menu has <Code>tabindex=0</Code>, all others use{" "}
                            <Code>-1</Code>.
                        </List.Item>
                    </List.Root>
                </VStack>
                <MenuSection
                    title="Horizontal Menu"
                    description="Use Left/Right arrow keys or Home/End keys to navigate between buttons."
                >
                    <HorizontalMenu />
                </MenuSection>
                <MenuSection
                    title="Vertical Menu"
                    description="Use Up/Down arrow keys or Home/End keys to navigate between buttons."
                >
                    <VerticalMenu />
                </MenuSection>
            </VStack>
        </Container>
    );
}

function MenuSection(props: { title: string; description: string; children: React.ReactNode }) {
    const { title, description, children } = props;
    return (
        <Box borderWidth="1px" borderRadius="lg" p={5}>
            <VStack gap={3} align="stretch">
                <Heading size="md">{title}</Heading>
                <Text fontSize="sm">{description}</Text>
                {children}
            </VStack>
        </Box>
    );
}

function HorizontalMenu() {
    const { menuProps, menuState } = useRovingMenu({
        orientation: "horizontal"
    });

    return (
        <HStack {...menuProps} justify="center" gap={5} padding={2}>
            <RovingMenuRoot menuState={menuState}>
                <MenuItem value="1" />
                <MenuItem value="2" />
                <MenuItem value="3" />
                <MenuItem value="4" />
            </RovingMenuRoot>
        </HStack>
    );
}

function VerticalMenu() {
    const { menuProps, menuState } = useRovingMenu({
        orientation: "vertical"
    });

    return (
        <VStack {...menuProps} justify="center" gap={5} padding={2}>
            <RovingMenuRoot menuState={menuState}>
                <MenuItem value="A" />
                <MenuItem value="B" />
                <MenuItem value="C" />
                <MenuItem value="D" />
            </RovingMenuRoot>
        </VStack>
    );
}

function MenuItem(props: { value: string }) {
    const { value } = props;
    const { itemProps } = useRovingMenuItem({
        value
    });

    return (
        <Button {...itemProps} onClick={() => console.log(`Button ${value} triggered.`)}>
            {value}
        </Button>
    );
}
