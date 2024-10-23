// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    VStack,
    Heading,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Alert,
    Text
} from "@open-pioneer/chakra-integration";
import { PackageIntl } from "./i18n";

const MESSAGES_DE = {
    "title": "Anwendungsstart fehlgeschlagen",
    "alertTitle": "Fehler",
    "alertDescription": "Leider ist beim Start der Anwendung ein Fehler aufgetreten."
};

const MESSAGES_EN = {
    "title": "Application start failed",
    "alertTitle": "Error",
    "alertDescription": "Unfortunately an error occurred during application start."
};

export const MESSAGES_BY_LOCALE: Record<"en" | "de", Record<string, string>> = {
    "en": MESSAGES_EN,
    "de": MESSAGES_DE
};

const isDev = import.meta.env.DEV;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Error = any;

export function ErrorScreen(props: { intl: PackageIntl; error: Error }) {
    const intl = props.intl;
    return (
        <Box>
            <VStack padding={4} width="100%" height="100%">
                <Heading size="md">{intl.formatMessage({ id: "title" })}</Heading>
                <Alert status="error" maxWidth={550} borderRadius="4px" mt={2}>
                    <AlertIcon />
                    <AlertTitle>{intl.formatMessage({ id: "alertTitle" })}</AlertTitle>
                    <AlertDescription>
                        {intl.formatMessage({ id: "alertDescription" })}
                    </AlertDescription>
                </Alert>

                {isDev && (
                    <Box
                        className="error-details"
                        mt={4}
                        p={2}
                        maxWidth="100%"
                        border={"dotted 2px"}
                        borderColor={"red.600"}
                        borderRadius={"4px"}
                    >
                        <Text color={"red.600"} fontWeight={"bold"}>
                            Error details:
                        </Text>
                        <ErrorRenderer error={props.error} />
                    </Box>
                )}
            </VStack>
        </Box>
    );
}

/**
 * Renders a single error instance.
 */
function ErrorRenderer(props: { error: Error }) {
    const error = props.error;
    const stackTrace = import.meta.env.DEV && error?.stack;
    const stackTraceDisplay = stackTrace && (
        <>
            <Box
                p="2"
                mt={1}
                mb={3}
                maxHeight="500px"
                whiteSpace="pre"
                wordBreak="keep-all"
                overflow="auto"
                border="1px solid grey"
                borderRadius="4px"
                color="gray.700"
                fontSize="12px"
                fontFamily="monospace"
            >
                {stackTrace}
            </Box>
            Inspect the console to see more details.
        </>
    );
    return (
        <Box p={2} className={"error-screen-stack-trace"}>
            <Text fontStyle={"italic"}>Error: {error?.message || "Unknown"}</Text>
            {stackTraceDisplay}
        </Box>
    );
}
