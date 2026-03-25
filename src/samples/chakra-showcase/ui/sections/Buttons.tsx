// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Box,
    Button,
    CloseButton,
    DownloadTrigger,
    Heading,
    HStack,
    IconButton,
    VStack
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { Presenter } from "../components/Presenter";

export function Buttons() {
    const data = "The quick brown fox jumps over the lazy dog";
    return (
        <Box display="flex" flexDirection="column" gap="4" alignItems="flex-start">
            <Presenter title="Button" link="https://chakra-ui.com/docs/components/button">
                <Button>Click me</Button>

                <VStack alignItems="flex-start" gap="2" my="4">
                    <Heading as="h4" size="sm">
                        Variants
                    </Heading>
                    <HStack wrap="wrap" gap="6">
                        <Button variant="solid">Solid</Button>
                        <Button variant="subtle">Subtle</Button>
                        <Button variant="surface">Surface</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="plain">Plain</Button>
                    </HStack>
                </VStack>

                <VStack alignItems="flex-start" gap="2" my="4">
                    <Heading as="h4" size="sm">
                        States
                    </Heading>
                    <HStack wrap="wrap" gap="6">
                        <Button disabled>disabled</Button>
                        <Button loading>loading</Button>
                        <Button loading loadingText="loading...">
                            loading with text
                        </Button>
                    </HStack>
                </VStack>
            </Presenter>

            <Presenter
                title="Close Button"
                link="https://chakra-ui.com/docs/components/close-button"
            >
                <CloseButton />
            </Presenter>

            <Presenter title="Icon Button" link="https://chakra-ui.com/docs/components/icon-button">
                <IconButton aria-label="Search database" variant="outline">
                    <LuSearch />
                </IconButton>
            </Presenter>

            <Presenter
                title="Download Trigger"
                link="https://chakra-ui.com/docs/components/download-trigger"
            >
                <DownloadTrigger data={data} fileName="sample.txt" mimeType="text/plain" asChild>
                    <Button variant="outline">Download txt</Button>
                </DownloadTrigger>
            </Presenter>
        </Box>
    );
}
