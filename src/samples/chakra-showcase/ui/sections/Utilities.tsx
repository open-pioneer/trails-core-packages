// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    Center,
    Checkmark,
    ClientOnly,
    For,
    Portal,
    Presence,
    Radiomark,
    Show,
    Skeleton,
    SkipNavContent,
    SkipNavLink,
    Stack,
    Text,
    Theme,
    useDisclosure,
    VisuallyHidden
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuBell } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

export function Utilities() {
    const { open, onToggle } = useDisclosure();
    const [count, setCount] = useState(0);
    const containerRef = useRef(null);

    return (
        <Box spaceY="4">
            <Presenter title="Checkmark" link="https://chakra-ui.com/docs/components/checkmark">
                <Stack>
                    <Checkmark />
                    <Checkmark checked />
                    <Checkmark indeterminate />
                    <Checkmark disabled />
                    <Checkmark checked disabled />
                    <Checkmark indeterminate disabled />
                </Stack>
            </Presenter>

            <Presenter title="Client Only" link="https://chakra-ui.com/docs/components/client-only">
                <ClientOnly fallback={<Skeleton />}>
                    {() => (
                        <div>
                            Current URL: {globalThis.location.href}
                            <br />
                            Screen width: {globalThis.innerWidth}px
                        </div>
                    )}
                </ClientOnly>
            </Presenter>

            {/* TODO: Environment Provider? */}

            <Presenter title="For" link="https://chakra-ui.com/docs/components/for">
                <Box borderColor="border.disabled" color="fg.disabled">
                    <For each={["One", "Two", "Three"]}>
                        {(item, index) => <div key={index}>{item}</div>}
                    </For>
                </Box>
            </Presenter>

            <Presenter title="Presence" link="https://chakra-ui.com/docs/components/presence">
                <Stack gap="4">
                    <Button alignSelf="flex-start" onClick={onToggle}>
                        Toggle Presence
                    </Button>
                    <Presence
                        present={open}
                        animationName={{ _open: "fade-in", _closed: "fade-out" }}
                        animationDuration="moderate"
                    >
                        <Center p="10" layerStyle="fill.muted">
                            Fade
                        </Center>
                    </Presence>
                </Stack>
            </Presenter>

            <Presenter title="Portal" link="https://chakra-ui.com/docs/components/portal">
                <Portal container={containerRef}>
                    <div>Portal content</div>
                </Portal>
                <div ref={containerRef} />
            </Presenter>

            <Presenter title="Radiomark" link="https://chakra-ui.com/docs/components/radiomark">
                <Stack>
                    <Radiomark />
                    <Radiomark checked />
                    <Radiomark disabled />
                    <Radiomark checked disabled />
                </Stack>
            </Presenter>

            <Presenter
                title="Show (reveals after 4 clicks)"
                link="https://chakra-ui.com/docs/components/show"
            >
                <Stack align="flex-start">
                    <Button variant="outline" onClick={() => setCount(count + 1)}>
                        Value: {count}
                    </Button>
                    <Show when={count > 3}>
                        <div>My Content</div>
                    </Show>
                </Stack>
            </Presenter>

            <Presenter title="Skip Nav" link="https://chakra-ui.com/docs/components/skip-nav">
                <SkipNavLink>Skip to Content</SkipNavLink>

                {/* Simulated navigation */}
                <Box p="4" bg="gray.100" borderRadius="md" mb="4">
                    <Text fontWeight="medium" mb="2">
                        Navigation
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        This represents a navigation area that users might want to skip over.
                    </Text>
                </Box>

                {/* Main content area */}
                <SkipNavContent>
                    <Box p="4" bg="blue.50" borderRadius="md">
                        <Text fontWeight="medium" mb="2">
                            Main Content
                        </Text>
                        <Text fontSize="sm">
                            This is the main content area. When users press Tab and then Enter on
                            the &quote;Skip to Content&quote; link, focus will jump directly here,
                            bypassing the navigation.
                        </Text>
                    </Box>
                </SkipNavContent>
            </Presenter>

            <Presenter
                title="Visually Hidden"
                link="https://chakra-ui.com/docs/components/visually-hidden"
            >
                <Button>
                    <LuBell /> 3 <VisuallyHidden>Notifications</VisuallyHidden>
                </Button>
            </Presenter>

            <Presenter title="Theme" link="https://chakra-ui.com/docs/components/theme">
                <Stack align="flex-start">
                    <Button variant="surface" colorPalette="teal">
                        Auto Button
                    </Button>
                    <Theme p="4" appearance="dark" colorPalette="teal">
                        <Button variant="surface">Dark Button</Button>
                    </Theme>
                    <Theme p="4" appearance="light" colorPalette="teal">
                        <Button variant="surface">Light Button</Button>
                    </Theme>
                </Stack>
            </Presenter>
        </Box>
    );
}
