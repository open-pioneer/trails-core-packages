// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthService, ForceAuth, useAuthState } from "@open-pioneer/authentication";
import {
    Box,
    Button,
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
import { HttpService } from "@open-pioneer/http";

export function AppUI() {
    const authService = useService<AuthService>("authentication.AuthService");
    const httpService = useService<HttpService>("http.HttpService");
    const authState = useAuthState(authService);
    const sessionInfo = authState.kind == "authenticated" ? authState.sessionInfo : undefined;
    const userName = sessionInfo?.userName;
    const doRequest = () => {
        httpService
            .fetch(
                "https://ogc-api.nrw.de/inspire-us-kindergarten/v1/collections/governmentalservice/items?f=json"
            )
            .catch((err) => console.error("Request failed", err));
    };

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
                            <Code>.env.local</Code>):
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
                <ForceAuth
                    renderErrorFallback={(e: Error) => (
                        <>
                            <Box>An Error occured while trying to login!</Box>
                            <Box color={"red"}>{e.message}</Box>
                        </>
                    )}
                >
                    <VStack
                        align="center"
                        p={10}
                        mt={2}
                        spacing={3}
                        border="2px solid red"
                        borderRadius={5}
                    >
                        <Text textAlign="center">
                            This part of the application is only visible when logged in.
                        </Text>
                        <LogoutButton />

                        <Text>
                            The following button triggers a request against a backend. The request
                            will automatically include the Keycloak token (see{" "}
                            <Code>SampleTokenInterceptor.ts</Code>):
                        </Text>
                        <Button onClick={doRequest}>Trigger Request With Token</Button>
                    </VStack>
                </ForceAuth>
            </Container>
        </>
    );
}
