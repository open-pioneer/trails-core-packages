// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import type { HttpService } from "./index";

export class HttpServiceImpl implements HttpService {
    async fetch(resource: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
        return await globalThis.fetch(resource, init);
    }
}
