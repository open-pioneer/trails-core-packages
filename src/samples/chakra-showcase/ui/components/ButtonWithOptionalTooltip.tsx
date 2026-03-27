// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@open-pioneer/chakra-snippets/tooltip";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function ButtonWithOptionalTooltip() {
    const [expanded, setExpanded] = useState(false);
    const text =
        "This button has a tooltip when collapsed, and none if expanded. " +
        'The button should not lose focus when pressing "Enter".';

    return (
        <Tooltip content={expanded ? null : text} disabled={expanded}>
            <Button onClick={() => setExpanded((prev) => !prev)}>
                {expanded ? (
                    <>
                        <LuChevronLeft />
                        Expand
                    </>
                ) : (
                    <LuChevronRight />
                )}
            </Button>
        </Tooltip>
    );
}
