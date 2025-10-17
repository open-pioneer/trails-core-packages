// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";

export class TextService {
    private text = reactive("not yet set");

    setText(text: string) {
        this.text.value = text;
    }

    getText(): string {
        return this.text.value;
    }
}
