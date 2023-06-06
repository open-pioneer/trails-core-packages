// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Central service for sending HTTP requests.
 *
 * Use the interface `"http.HttpService"` to obtain an instance of this service.
 */
export interface HttpService {
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

import "@open-pioneer/runtime";
declare module "@open-pioneer/runtime" {
    interface ServiceRegistry {
        "http.HttpService": HttpService;
    }
}

// Get rid of empty chunk warning
export default undefined;
