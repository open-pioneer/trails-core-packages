// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    VStack,
    Heading,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Alert
} from "@open-pioneer/chakra-integration";

// todo render error message if started in dev mode

export function ErrorScreen() {
    // todo how to access lang parameter? --> pass root as ref?
    return (
        <Box>
            <VStack padding={3}>
                <Heading size="md">Application start failed</Heading>
                <Alert status="error" maxWidth={550}>
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Unfortunately an error occurred during application start.
                    </AlertDescription>
                </Alert>
            </VStack>
        </Box>
    );
}
