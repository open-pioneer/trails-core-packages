// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { NotifierProperties } from "@open-pioneer/notifier";
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { AppUI } from "./AppUI";

const Element = createCustomElement({
    component: AppUI,
    appMetadata,
    config: {
        properties: {
            "@open-pioneer/notifier": {
                position: "top-right",
                offsets: {
                    "left": "1rem",
                    "top": "3rem",
                    "right": "1rem",
                    "bottom": "1rem"
                }
            } satisfies NotifierProperties
        }
    }
});

customElements.define("notify-app", Element);
