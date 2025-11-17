// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Button, Container, Text } from "@chakra-ui/react";
import { autoReactive } from "@open-pioneer/reactivity";
import { useState } from "react";
import { store } from "./store";

export function AppUI() {
    const [show, setShow] = useState(true);

    return (
        <Container maxW="xl">
            <Box minH="200px">{show && <Sample />}</Box>

            <Box textAlign="right">
                <Button mt={5} onClick={() => setShow(!show)}>
                    Toggle Mount
                </Button>
            </Box>
        </Container>
    );
}

const Sample = autoReactive(function SampleImpl() {
    const [count, setCount] = useState(0);
    useState(); // XXX: Causes problems in dev mode when adding or removing hooks (HMR)
    return (
        <>
            <Text>
                Reactive counter: {store.value} (auto){" "}
                <Button onClick={() => (store.value += 1)}>Increment</Button>
            </Text>
            <Text>
                Internal counter: {count}{" "}
                <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
            </Text>
        </>
    );
});
