// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { WarningTwoIcon } from "@chakra-ui/icons";
import {
    Box,
    Center,
    Container,
    CustomChakraProvider,
    Heading,
    Stack
} from "@open-pioneer/chakra-integration";
import { PackageContext } from "@open-pioneer/runtime-react-support";
import { StrictMode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type UiState } from "./ReactIntegration";

export interface RootUIProps {
    rootNode: Node;
    enableErrorBoundary?: boolean;
    state: UiState;
}

export function RootUI(props: RootUIProps): JSX.Element {
    const { rootNode, enableErrorBoundary = true, state } = props;

    let content;
    switch (state.type) {
        case "loading":
            content = null; // TODO: Splash screen?
            break;
        case "error":
            content = <ErrorUI error={state.error} />;
            break;
        case "ready":
            content = (
                <PackageContext.Provider value={state.packageContext}>
                    <state.Component />;
                </PackageContext.Provider>
            );
            break;
    }

    if (enableErrorBoundary) {
        content = <ErrorBoundary FallbackComponent={ErrorUI}>{content}</ErrorBoundary>;
    }

    return (
        <StrictMode>
            <CustomChakraProvider container={rootNode} colorMode="light">
                {content}
            </CustomChakraProvider>
        </StrictMode>
    );
}

/**
 * Shows an error message to the user.
 */
function ErrorUI(props: { error: unknown }) {
    return (
        <Center className="error-ui" width="100%" height="100%" bgColor="red.700" p={8}>
            <Container color="gray.200" maxWidth="100ch">
                <Heading
                    className="error-header"
                    as="h1"
                    size="xl"
                    display="flex"
                    alignItems="center"
                    gap="2"
                >
                    <WarningTwoIcon className="error-icon" />
                    Error
                </Heading>
                <Stack className="error-details" fontSize="20px" mt={1} spacing={1}>
                    <p>An error prevented the application from displaying correctly.</p>
                    <ErrorRenderer error={props.error} />
                </Stack>
            </Container>
        </Center>
    );
}

/**
 * Renders a single error instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ErrorRenderer(props: { error: any }) {
    const error = props.error;
    const stack = import.meta.env.DEV && error?.stack;
    const stackDisplay = stack && (
        <>
            <Box
                m="1"
                p="2"
                maxHeight="500px"
                whiteSpace="pre"
                wordBreak="keep-all"
                overflow="auto"
                border="1px solid white"
                borderRadius="5px"
                color="gray.300"
                fontSize="12px"
                fontFamily="monospace"
            >
                {stack}
            </Box>
            Inspect the console to see more details.
        </>
    );
    return (
        <>
            <p>Error: {error?.message || "Unknown"}</p>
            {stackDisplay}
        </>
    );
}
