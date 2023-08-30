// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { SampleUI } from "./SampleUI";
import { theme } from "./theme/theme";

const Element = createCustomElement({
    component: SampleUI,
    theme: theme,
    appMetadata
});

customElements.define("chakra-app", Element);
