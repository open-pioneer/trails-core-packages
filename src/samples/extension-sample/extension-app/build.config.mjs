// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    ui: {
        references: ["extension-app.ActionService"]
    },
    services: {
        ActionServiceImpl: {
            provides: ["extension-app.ActionService"],
            references: {
                providers: {
                    name: "extension-app.ActionProvider",
                    all: true
                }
            }
        },
        LoggingActionProvider: {
            provides: ["extension-app.ActionProvider"]
        },
        MultiActionProvider: {
            provides: ["extension-app.ActionProvider"]
        },
        OpenWindowActionProvider: {
            provides: ["extension-app.ActionProvider"]
        }
    }
});
