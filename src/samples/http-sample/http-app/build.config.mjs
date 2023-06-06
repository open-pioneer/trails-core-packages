// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0

import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    services: {
        HttpClient: {
            references: {
                http: "http.HttpService"
            },
            provides: "http-app.HttpClient"
        }
    },
    ui: {
        references: ["http-app.HttpClient"]
    }
});
