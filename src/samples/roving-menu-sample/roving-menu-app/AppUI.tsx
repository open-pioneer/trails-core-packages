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
import { ReactNode, useState } from "react";

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
                    description="Use Left/Right arrow keys or Home/End keys to navigate between buttons. Button '3' is always disabled."
                >
                    <HorizontalMenu />
                </MenuSection>
                <MenuSection
                    title="Vertical Menu"
                    description="Use Up/Down arrow keys or Home/End keys to navigate between buttons. Button 'B' unmounts itself on click. Button 'C' hides itself. Button 'D' disables itself."
                >
                    <VerticalMenu />
                </MenuSection>
            </VStack>
        </Container>
    );
}

function MenuSection(props: { title: string; description: string; children: ReactNode }) {
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
                <MenuItem value="3" disabled />
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
                <UnmountingMenuItem value="B" />
                <MenuItem value="C" hideOnClick />
                <MenuItem value="D" disableOnClick />
            </RovingMenuRoot>
        </VStack>
    );
}

function UnmountingMenuItem(props: { value: string }) {
    const { value } = props;
    const [mounted, setMounted] = useState(true);
    return mounted && <MenuItem value={value} onClick={() => setMounted(false)} />;
}

function MenuItem(props: {
    value: string;
    disabled?: boolean;
    disableOnClick?: boolean;
    hideOnClick?: boolean;
    onClick?: () => void;
}) {
    const { value, disableOnClick, hideOnClick, disabled: disabledProp, onClick } = props;
    const [disabledState, setDisabledState] = useState(false);
    const [hiddenState, setHiddenState] = useState(false);

    const disabled = disabledProp || disabledState || hiddenState;
    const { itemProps } = useRovingMenuItem({
        value,
        disabled: disabled
    });

    return (
        <Button
            aria-disabled={disabled}
            display={hiddenState ? "none" : "block"}
            {...itemProps}
            onClick={() => {
                if (disabled) {
                    return;
                }
                console.log(`Button ${value} triggered.`);
                if (disableOnClick) {
                    console.log(`Disabling button ${value}.`);
                    setDisabledState(true);
                }
                if (hideOnClick) {
                    console.log(`Hiding button ${value}.`);
                    setHiddenState(true);
                }

                onClick?.();
            }}
        >
            {value}
        </Button>
    );
}
