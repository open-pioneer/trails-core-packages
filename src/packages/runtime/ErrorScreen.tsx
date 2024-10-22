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
import { PackageIntl } from "./i18n";

const MESSAGES_DE = {
    "title": "Anwendungsstart fehlgeschlagen",
    "alertTitle": "Fehler",
    "alertDescription": "Leider ist beim Start der Anwendung eine Fehler aufgetreten."
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

// todo render error message (and callstack) if started in dev mode

export function ErrorScreen(props: { intl: PackageIntl }) {
    const intl = props.intl;
    return (
        <Box>
            <VStack padding={3}>
                <Heading size="md">{intl.formatMessage({ id: "title" })}</Heading>
                <Alert status="error" maxWidth={550}>
                    <AlertIcon />
                    <AlertTitle>{intl.formatMessage({ id: "alertTitle" })}</AlertTitle>
                    <AlertDescription>
                        {intl.formatMessage({ id: "alertDescription" })}
                    </AlertDescription>
                </Alert>
            </VStack>
        </Box>
    );
}
