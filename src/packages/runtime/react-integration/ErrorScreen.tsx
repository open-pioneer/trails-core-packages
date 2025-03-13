// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Alert, Box, Heading, Text, VStack } from "@chakra-ui/react";
import { PackageIntl } from "../i18n";

const MESSAGES_DE = {
    "title": "Anwendungsstart fehlgeschlagen",
    "alertTitle": "Fehler",
    "alertDescription": "Leider ist beim Start der Anwendung ein Fehler aufgetreten.",

    "details.title": "Fehlerdetails",
    "details.inspect": "Konsole öffnen, um weitere Details zu sehen.",
    "details.errorMessage": "Fehler: {message}"
};

const MESSAGES_EN = {
    "title": "Application start failed",
    "alertTitle": "Error",
    "alertDescription": "Unfortunately an error occurred during application start.",

    "details.title": "Error details",
    "details.inspect": "Inspect the console to see more details.",
    "details.errorMessage": "Error: {message}"
};

export const MESSAGES_BY_LOCALE: Record<"en" | "de", Record<string, string>> = {
    "en": MESSAGES_EN,
    "de": MESSAGES_DE
};

export function ErrorScreen(props: { intl: PackageIntl; error: Error }) {
    const intl = props.intl;
    return (
        <VStack padding={4} width="100%" height="100%" minWidth="350px" minHeight="150px">
            <Heading>{intl.formatMessage({ id: "title" })}</Heading>
            <Alert.Root status="error" size="lg" maxWidth={550} borderRadius="4px" mt={2}>
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title fontWeight="bold">
                        {intl.formatMessage({ id: "alertTitle" })}
                    </Alert.Title>
                    <Alert.Description>
                        {intl.formatMessage({ id: "alertDescription" })}
                    </Alert.Description>
                </Alert.Content>
            </Alert.Root>

            {import.meta.env.DEV && (
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
                        {intl.formatMessage({ id: "details.title" }) + ":"}
                    </Text>
                    <ErrorRenderer {...props} />
                </Box>
            )}
        </VStack>
    );
}

/**
 * Renders a single error instance.
 */
function ErrorRenderer(props: { error: Error; intl: PackageIntl }) {
    const { error, intl } = props;
    const message = error?.message || "Unknown";
    const stackTrace = error?.stack;
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
            {intl.formatMessage({ id: "details.inspect" })}
        </>
    );
    return (
        <Box p={2} className={"error-screen-stack-trace"}>
            <Text fontStyle={"italic"}>
                {intl.formatMessage({ id: "details.errorMessage" }, { message })}
            </Text>
            {stackTraceDisplay}
        </Box>
    );
}
