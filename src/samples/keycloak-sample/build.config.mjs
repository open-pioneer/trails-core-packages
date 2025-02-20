// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    i18n: ["de", "en"],
    services: {
        SampleTokenInterceptor: {
            provides: ["http.Interceptor"],
            references: {
                authService: "authentication.AuthService"
            }
        }
    },

    ui: {
        references: ["authentication.AuthService", "http.HttpService"]
    }
});
