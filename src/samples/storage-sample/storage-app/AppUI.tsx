// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Box, Button, Container, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import type {
    LocalStorageService,
    SessionStorageService,
    StorageService
} from "@open-pioneer/local-storage";
import { useService } from "open-pioneer:react-hooks";
import { useCallback, useEffect, useState } from "react";
import { STORAGE_ID } from "./storageId";

export function AppUI() {
    const localStorageService = useService<LocalStorageService>(
        "local-storage.LocalStorageService"
    );
    const sessionStorageService = useService<SessionStorageService>(
        "local-storage.SessionStorageService"
    );

    return (
        <Container maxWidth="6xl" py={6}>
            <VStack align="stretch" gap={5}>
                <Box>
                    <Heading size="lg">Storage Sample</Heading>
                    <Text mt={2}>
                        Both services are configured with the same storage id{" "}
                        <code>{STORAGE_ID}</code>, each writing into its own storage area.
                    </Text>
                    <Box ml="4" as="ul" listStyleType="circle" listStylePosition="outside">
                        <li>Reload the page and both keep their values.</li>
                        <li>
                            Close the tab, then open the sample again: only local storage still has
                            data.
                        </li>
                        <li>
                            Open the sample in a second tab to see that local storage is shared
                            while session storage is not.
                        </li>
                    </Box>
                </Box>

                <HStack align="stretch" gap={6} flexDirection={{ base: "column", md: "row" }}>
                    <StoragePanel
                        title="Local storage"
                        service={localStorageService}
                        area={window.localStorage}
                    />
                    <StoragePanel
                        title="Session storage"
                        service={sessionStorageService}
                        area={window.sessionStorage}
                    />
                </HStack>
            </VStack>
        </Container>
    );
}

interface StoragePanelProps {
    title: string;
    service: StorageService;
    area: Storage;
}

function StoragePanel({ title, service, area }: StoragePanelProps) {
    const [key, setKey] = useState("greeting");
    const [value, setValue] = useState("hello");
    const [raw, setRaw] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const refresh = useCallback(() => {
        setRaw(area.getItem(STORAGE_ID) ?? undefined);
    }, [area]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const run = (action: () => void) => {
        try {
            setError(undefined);
            action();
        } catch (e) {
            setError(String(e));
        }

        // Storage service debounces the actual save operation
        setTimeout(() => {
            refresh();
        }, 10);
    };

    return (
        <Box flex="1" borderWidth="1px" borderRadius="md" p={4}>
            <VStack align="stretch" gap={3}>
                <HStack justifyContent="space-between">
                    <Heading size="md">{title}</Heading>
                    <Text fontSize="sm" color={service.isSupported ? "green.600" : "red.600"}>
                        {service.isSupported ? "supported" : "not supported"}
                    </Text>
                </HStack>

                <HStack gap={2}>
                    <Input
                        size="sm"
                        placeholder="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <Input
                        size="sm"
                        placeholder="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </HStack>
                <Text fontSize="xs" color="gray.600">
                    The value is parsed as JSON when possible, otherwise stored as a string.
                </Text>

                <HStack gap={2} flexWrap="wrap">
                    <Button
                        size="sm"
                        onClick={() => run(() => service.set(key, parseValue(value)))}
                    >
                        Set
                    </Button>
                    <Button size="sm" onClick={() => run(() => service.remove(key))}>
                        Remove key
                    </Button>
                    <Button
                        size="sm"
                        colorPalette="red"
                        onClick={() => run(() => service.removeAll())}
                    >
                        Remove all
                    </Button>
                    <Button size="sm" variant="outline" onClick={refresh}>
                        Refresh
                    </Button>
                </HStack>

                {error && (
                    <Text fontSize="sm" color="red.600">
                        {error}
                    </Text>
                )}

                <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                        Contents of <code>{STORAGE_ID}</code>:
                    </Text>
                    <Box
                        as="pre"
                        mt={1}
                        p={2}
                        fontSize="xs"
                        borderRadius="sm"
                        backgroundColor="gray.100"
                        overflowX="auto"
                    >
                        {raw ? format(raw) : "(nothing stored)"}
                    </Box>
                </Box>
            </VStack>
        </Box>
    );
}

function parseValue(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function format(json: string): string {
    try {
        return JSON.stringify(JSON.parse(json), undefined, 2);
    } catch {
        return json;
    }
}
