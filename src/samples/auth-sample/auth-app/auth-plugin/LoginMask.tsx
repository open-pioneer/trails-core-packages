// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    VStack
} from "@open-pioneer/chakra-integration";
import { useState } from "react";

interface LoginMaskProps {
    wasLoggedIn: boolean;
    doLogin: (userName: string, password: string) => string | undefined;
    doFail: () => void;
}

export function LoginMask({ doLogin, doFail, wasLoggedIn }: LoginMaskProps) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [showLoggedOutMessage, setShowLoggedOutMessage] = useState(wasLoggedIn);
    const onSubmit = (e: Pick<Event, "preventDefault">) => {
        e.preventDefault();
        const errorMessage = doLogin(userName, password);
        setErrorMessage(errorMessage || "");
        setShowLoggedOutMessage(false);
    };

    return (
        <Container p={5}>
            <VStack as="form" onSubmit={onSubmit} spacing={4}>
                <Heading as="h1" textAlign="center">
                    Login
                </Heading>
                <Text textAlign="center">
                    Please enter your user name and password to authenticate.
                    <br />
                    Note: credentials are {'"admin"'} / {'"admin"'}
                </Text>
                {errorMessage && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>{errorMessage}</AlertTitle>
                    </Alert>
                )}
                {showLoggedOutMessage && (
                    <Alert status="info" mb={5}>
                        <AlertIcon />
                        <AlertDescription>
                            Logout successful.
                            <br />
                            You can use the form below to log in again.
                        </AlertDescription>
                    </Alert>
                )}
                <FormControl>
                    <FormLabel>User name</FormLabel>
                    <Input
                        placeholder="User name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="username"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            pr="4.5rem"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <InputRightElement width="4.5rem">
                            <Button
                                h="1.75rem"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <HStack>
                    <Button colorScheme={"red"} onClick={doFail}>
                        Let it fail!
                    </Button>
                    <Button type="submit">Login</Button>
                </HStack>
            </VStack>
        </Container>
    );
}
