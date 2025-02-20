// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    entryPoints: ["index"],
    i18n: ["en", "de"],
    services: {
        AuthServiceImpl: {
            provides: "authentication.AuthService",
            references: {
                plugin: "authentication.AuthPlugin"
            }
        }
    },
    ui: {
        references: ["authentication.AuthService"]
    },
    publishConfig: {
        strict: true
    }
});
