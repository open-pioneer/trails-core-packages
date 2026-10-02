// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { reactive } from "@conterra/reactivity-core";
import { DECLARE_SERVICE_INTERFACE } from "@open-pioneer/runtime";

export class TextService {
    declare [DECLARE_SERVICE_INTERFACE]: "api-app.TextService";

    #text = reactive("not yet set");

    setText(text: string) {
        this.#text.value = text;
    }

    getText(): string {
        return this.#text.value;
    }
}
