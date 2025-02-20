// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Interceptor, BeforeRequestParams } from "@open-pioneer/http";
import { createLogger } from "@open-pioneer/core";

const LOG = createLogger("http-app:ExampleInterceptor");

export class ExampleInterceptor implements Interceptor {
    async beforeRequest?(params: BeforeRequestParams) {
        LOG.info("interceptor invoked with", params);
        // adds an example query parameter to every request (see browser's network log)
        params.target.searchParams.set("a", "b");
    }
}
