// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Box, HStack } from "@chakra-ui/react";
import { Presenter } from "../components/Presenter";
import { ColorPaletteSwitcher } from "../components/ColorPaletteSwitcher";

export function Theming() {
    return (
        <Box width={"full"} display="flex" flexDirection="column" gap="4" alignItems="flex-start">
            <Presenter title="Current color palette">
                <ColorPaletteDemo />
            </Presenter>
            <Presenter title="Change color palette">
                <ColorPaletteSwitcher />
            </Presenter>
        </Box>
    );
}

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Demo component to showcase color palette usage.
 */
const ColorPaletteDemo = () => (
    <HStack w="100%" gap={1} justify="space-between">
        {SHADES.map((shade) => (
            <Box key={shade} height={25} flex={"1 1 auto"} bg={`colorPalette.${shade}`} />
        ))}
    </HStack>
);
