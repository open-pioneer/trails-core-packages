// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ApplicationProperties, createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { AppUI } from "./AppUI";

const element = createCustomElement({
    component: AppUI,
    appMetadata,
    async resolveConfig(ctx) {
        const customLevel = ctx.getAttribute("level") ?? "INFO";
        const customPosition = ctx.getAttribute("position") ?? "top-right";
        const properties: ApplicationProperties = {
            "properties-app": {
                notifierLevel: customLevel
            },
            "@open-pioneer/notifier": {
                position: customPosition
            }
        };
        return { properties };
    }
});

customElements.define("properties-app", element);
