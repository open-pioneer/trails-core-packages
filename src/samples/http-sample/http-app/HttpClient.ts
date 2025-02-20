// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ServiceOptions } from "@open-pioneer/runtime";
import { HttpService } from "@open-pioneer/http";

interface References {
    http: HttpService;
}

const URL = `https://registry.npmjs.org/@open-pioneer/runtime`;

export class HttpClient {
    #http: HttpService;

    constructor(options: ServiceOptions<References>) {
        this.#http = options.references.http;
    }

    /** Fetches NPM metadata of the `runtime` package, returns JSON. */
    async fetchResource(): Promise<Record<string, unknown>> {
        const response = await this.#http.fetch(URL, {
            headers: {
                Accept: "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Request failed: " + response.status);
        }
        return await response.json();
    }
}
