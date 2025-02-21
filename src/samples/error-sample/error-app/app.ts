// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { createElement } from "react";

const element = createCustomElement({
    component: () => createElement("div"),
    appMetadata,
    resolveConfig(_ctx) {
        throw new Error("This is a test error.");
    }
});

customElements.define("error-app", element);
