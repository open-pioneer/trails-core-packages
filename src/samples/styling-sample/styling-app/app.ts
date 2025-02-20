// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createCustomElement } from "@open-pioneer/runtime";
import { SampleComponentWithCss } from "styling-sample-components";
import * as appMetadata from "open-pioneer:app";

const Element = createCustomElement({
    component: SampleComponentWithCss,
    appMetadata
});

console.log(`CSS:\n\n${appMetadata.styles.value}`);

customElements.define("styling-app", Element);
