// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { config } from "./theme/config";
import { SampleUI } from "./SampleUI";

const Element = createCustomElement({
    component: SampleUI,
    chakraSystemConfig: config,
    appMetadata
});

customElements.define("chakra-app", Element);
