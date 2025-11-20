// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    i18n: ["en", "de"],
    entryPoints: [
        "alert.tsx",
        "avatar.tsx",
        "blockquote.tsx",
        "breadcrumb.tsx",
        "carousel.tsx",
        "checkbox.tsx",
        "checkbox-card.tsx",
        "clipboard.tsx",
        "close-button.tsx",
        "combobox.tsx",
        "data-list.tsx",
        "empty-state.tsx",
        "field.tsx",
        "input-group.tsx",
        "link-button.tsx",
        "native-select.tsx",
        "number-input.tsx",
        "password-input.tsx",
        "pin-input.tsx",
        "prose.tsx",
        "qr-code.tsx",
        "radio.tsx",
        "radio-card.tsx",
        "rating.tsx",
        "slider.tsx",
        "status.tsx",
        "stepper-input.tsx",
        "switch.tsx",
        "tag.tsx",
        "toggle.tsx",
        "toggle-tip.tsx",
        "tooltip.tsx"
    ],
    publishConfig: {
        strict: true
    }
});
