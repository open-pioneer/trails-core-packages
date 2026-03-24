// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Icon, Switch } from "@chakra-ui/react";
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { ThemeService } from "@open-pioneer/runtime";
import { useService } from "open-pioneer:react-hooks";
import { FaMoon, FaSun } from "react-icons/fa";

export function ColorModeSwitcher() {
    const themeService = useService<ThemeService>("runtime.ThemeService");
    const colorMode = useReactiveSnapshot(() => themeService.colorMode, [themeService]);
    return (
        <Switch.Root
            checked={colorMode === "dark"}
            onCheckedChange={({ checked }) => themeService.setColorMode(checked ? "dark" : "light")}
            size="lg"
        >
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb />
                <Switch.Indicator fallback={<Icon as={FaMoon} color="colorPalette.solid" />}>
                    <Icon as={FaSun} color="colorPalette.inverted" />
                </Switch.Indicator>
            </Switch.Control>
            <Switch.Label>Color Mode</Switch.Label>
        </Switch.Root>
    );
}
