// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Button, HStack, mergeConfigs } from "@chakra-ui/react";
import { config as baseConfig } from "@open-pioneer/base-theme";
import { ThemeService } from "@open-pioneer/runtime";
import { useService } from "open-pioneer:react-hooks";

const builtinColorPallettes = [
    "trails",
    "gray",
    "red",
    "pink",
    "purple",
    "cyan",
    "blue",
    "teal",
    "green",
    "yellow",
    "orange"
];

export function ColorPaletteSwitcher() {
    const themeService = useService<ThemeService>("runtime.ThemeService");
    const changeColorPalette = (name: string) => {
        const config = mergeConfigs(baseConfig, {
            globalCss: {
                html: {
                    colorPalette: name
                }
            }
        });
        themeService.setSystemConfig(config);
    };

    return (
        <HStack justify="center">
            {builtinColorPallettes.map((name) => (
                <Button
                    key={name}
                    onClick={() => {
                        changeColorPalette(name);
                    }}
                >
                    {name}
                </Button>
            ))}
        </HStack>
    );
}
