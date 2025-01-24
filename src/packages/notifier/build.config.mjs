// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    i18n: ["en", "de"],
    entryPoints: ["index"],
    services: {
        NotificationServiceImpl: {
            provides: "notifier.NotificationService",
            references: {
                appCtx: "runtime.ApplicationContext"
            }
        }
    },
    ui: {
        references: ["notifier.NotificationService"]
    },
    publishConfig: {
        strict: true
    },
    properties: {
        position: "top-right"
    }
});
