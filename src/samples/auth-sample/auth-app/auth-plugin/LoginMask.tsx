// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Alert, Button, Container, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Field } from "../snippets/field";
import { PasswordInput } from "../snippets/password-input";

interface LoginMaskProps {
    wasLoggedIn: boolean;
    doLogin: (userName: string, password: string) => string | undefined;
    doFail: () => void;
}

export function LoginMask({ doLogin, doFail, wasLoggedIn }: LoginMaskProps) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [showLoggedOutMessage, setShowLoggedOutMessage] = useState(wasLoggedIn);
    const onSubmit = (e: Pick<Event, "preventDefault">) => {
        e.preventDefault();
        const errorMessage = doLogin(userName, password);
        setErrorMessage(errorMessage || "");
        setShowLoggedOutMessage(false);
    };

    return (
        <Container p={5} maxWidth={"xl"}>
            <VStack as="form" onSubmit={onSubmit} gap={4}>
                <Heading as="h1" textAlign="center">
                    Login
                </Heading>
                <Text textAlign="center">
                    Please enter your user name and password to authenticate.
                    <br />
                    Note: credentials are {'"admin"'} / {'"admin"'}
                </Text>
                {errorMessage && (
                    <Alert.Root status="error">
                        <Alert.Indicator></Alert.Indicator>
                        <Alert.Content>
                            <Alert.Title>{errorMessage}</Alert.Title>
                        </Alert.Content>
                    </Alert.Root>
                )}
                {showLoggedOutMessage && (
                    <Alert.Root status="info" mb={5}>
                        <Alert.Indicator></Alert.Indicator>
                        <Alert.Content>
                            <Alert.Description>
                                Logout successful.
                                <br />
                                You can use the form below to log in again.
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                )}
                <Field label={"User name"}>
                    <Input
                        placeholder="User name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="username"
                    />
                </Field>
                <Field label={"Password"}>
                    <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
                <HStack>
                    <Button colorPalette={"red"} onClick={doFail}>
                        Let it fail!
                    </Button>
                    <Button type="submit">Login</Button>
                </HStack>
            </VStack>
        </Container>
    );
}
