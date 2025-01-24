// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ForceAuth } from "@open-pioneer/authentication";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { LogoutButton } from "./LogoutButton";

export function AppUI() {
    return (
        <ForceAuth errorFallback={ErrorFallback}>
            <Container p={5}>
                <Heading as="h1">Authenticated</Heading>
                This is the actual content of the app. Authentication was successful.
                <Flex pt={5} flexDirection="row" justifyContent="center">
                    <LogoutButton />
                </Flex>
            </Container>
        </ForceAuth>
    );
}

export function ErrorFallback(props: { error: Error }) {
    return (
        <>
            <Box margin={2} color={"red"}>
                {props.error.message}
            </Box>
            <Button margin={2} onClick={() => window.location.reload()}>
                reload
            </Button>
        </>
    );
}
