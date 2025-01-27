// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { themeConfig } from "./theme/theme";
import { SampleUI } from "./SampleUI";

const Element = createCustomElement({
    component: SampleUI,
    chakraConfig: themeConfig,
    appMetadata
});

customElements.define("chakra-app", Element);
