// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthService, ForceAuth, useAuthState } from "@open-pioneer/authentication";
import {
    Code,
    Container,
    Flex,
    Heading,
    ListItem,
    Text,
    UnorderedList,
    VStack
} from "@open-pioneer/chakra-integration";
import { Notifier } from "@open-pioneer/notifier";
import { useService } from "open-pioneer:react-hooks";
import { LogoutButton } from "./LogoutButton";

export function AppUI() {
    const authService = useService<AuthService>("authentication.AuthService");
    const authState = useAuthState(authService);
    const sessionInfo = authState.kind == "authenticated" ? authState.sessionInfo : undefined;
    const userName = sessionInfo?.userName;

    return (
        <>
            <Notifier />
            <Container maxW="800px">
                <Flex height="100%" direction="column" overflow="hidden">
                    <Heading as="h1" size="2xl">
                        Keycloak Sample
                    </Heading>

                    <VStack mt={4} spacing={2} align="stretch">
                        <Heading as="h2" size="xl">
                            Additional Setup
                        </Heading>
                        <Text>
                            This application requires additional setup. Most importantly, a Keycloak
                            installation must be present.
                        </Text>
                        <Text>
                            The following environment properties should be set via vite (e.g. in{" "}
                            <Code>env.local</Code>):
                        </Text>
                        <UnorderedList>
                            <ListItem>
                                <Code>VITE_KEYCLOAK_CONFIG_URL</Code> (the URL to the Keycloak
                                instance)
                            </ListItem>
                            <ListItem>
                                <Code>VITE_KEYCLOAK_CONFIG_REALM</Code> (the Keycloak realm)
                            </ListItem>
                            <ListItem>
                                <Code>VITE_KEYCLOAK_CONFIG_CLIENT_ID</Code> (the client id of this
                                application)
                            </ListItem>
                        </UnorderedList>

                        <Text textAlign="center">
                            <Text as="b">Status: </Text>
                            {userName != null ? (
                                <>
                                    Logged in as <Code>{userName}</Code>.
                                </>
                            ) : (
                                <>Not logged in.</>
                            )}
                        </Text>
                    </VStack>
                </Flex>
                <ForceAuth>
                    <VStack
                        align="center"
                        p={10}
                        mt={2}
                        spacing={3}
                        border="2px solid red"
                        borderRadius={5}
                    >
                        <Text color="red" textAlign="center">
                            This part of the application is only visible when logged in.
                        </Text>
                        <LogoutButton />
                    </VStack>
                </ForceAuth>
            </Container>
        </>
    );
}
