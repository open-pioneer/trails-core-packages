// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Box, Button } from "@open-pioneer/chakra-integration";

export interface DevToolsBadgeProps {
    onOpen: () => void;
}

export function DevToolsBadge(props: DevToolsBadgeProps) {
    return (
        <Box
            position="absolute"
            right="0px"
            top="50%"
            transform="translateY(-50%)" // vertical center
            // Center children
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
        >
            <Button
                tabIndex={-1} // not focusable on purpose
                h="auto"
                w="auto"
                sx={{
                    writingMode: "vertical-lr"
                }}
                onClick={props.onOpen}
            >
                Open Dev Tools
            </Button>
        </Box>
    );
}
