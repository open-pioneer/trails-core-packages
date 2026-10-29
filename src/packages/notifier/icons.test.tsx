// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { Icon } from "@chakra-ui/react";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { defaultIcons } from "./icons";

it("renders as an svg", () => {
    render(<Icon as={defaultIcons.info} data-testid="icon" />, {
        wrapper(props) {
            return <PackageContextProvider {...props} />;
        }
    });
    const icon = screen.getByTestId("icon");
    expect(icon.tagName).toBe("svg");
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.innerHTML).not.toHaveLength(0);
});
