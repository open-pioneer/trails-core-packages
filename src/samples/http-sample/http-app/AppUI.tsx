// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useService } from "open-pioneer:react-hooks";
import type { HttpClient } from "./HttpClient";
import { useEffect, useState } from "react";
import { Box, VStack, Text } from "@open-pioneer/chakra-integration";
import ReactJson from "react-json-view";

export function AppUI() {
    const client = useService<unknown>("http-app.HttpClient") as HttpClient;
    const [json, setJson] = useState<unknown>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    useEffect(() => {
        client
            .fetchResource()
            .then((resource) => {
                setJson(resource);
            })
            .catch((error) => {
                setError(String(error));
            });
    }, [client]);

    if (error) {
        return <Box>Error: {error}</Box>;
    }
    if (!json) {
        return <Box>Loading...</Box>;
    }
    return (
        <Box>
            <VStack>
                <Text>Fetched Metadata:</Text>
                <Box maxHeight="700px" maxWidth="100%" overflow="scroll" backgroundColor="#eeeeee">
                    <ReactJson src={json}></ReactJson>
                </Box>
            </VStack>
        </Box>
    );
}
