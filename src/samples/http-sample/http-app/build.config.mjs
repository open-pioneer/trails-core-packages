// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    services: {
        HttpClient: {
            references: {
                http: "http.HttpService"
            },
            provides: "http-app.HttpClient"
        },
        ExampleInterceptor: {
            provides: "http.Interceptor"
        }
    },
    ui: {
        references: ["http-app.HttpClient"]
    }
});
