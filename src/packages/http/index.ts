// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { DeclaredService } from "@open-pioneer/runtime";

/**
 * Central service for sending HTTP requests.
 *
 * Use the interface `"http.HttpService"` to obtain an instance of this service.
 */
export interface HttpService extends DeclaredService<"http.HttpService"> {
    /**
     * Requests the given `resource` via HTTP and returns the response.
     *
     * See [fetch documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for reference.
     *
     * > NOTE: In its current implementation this is a simple wrapper around the browser's fetch.
     * > Future versions may implement additional features on top of `fetch()` (such as support for a proxy backend).
     * >
     * > This service should still be used (instead of plain fetch) to automatically benefit from
     * > future developments.
     */
    fetch(resource: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

// TODO: Remove block with next major
import "@open-pioneer/runtime";
declare module "@open-pioneer/runtime" {
    interface ServiceRegistry {
        "http.HttpService": HttpService;
    }
}
