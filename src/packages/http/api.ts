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
    fetch(resource: string | URL, init?: HttpServiceRequestInit): Promise<Response>;
}

/**
 * Options for {@link HttpService.fetch}.
 */
export interface HttpServiceRequestInit extends RequestInit {
    /**
     * Arbitrary context properties for this http request.
     * These values can be accessed by interceptors.
     */
    context?: ContextData;
}

export type ResolvedRequestOptions = Omit<
    HttpServiceRequestInit,
    "method" | "headers" | "signal" | "context"
> & {
    method: string;
    headers: Headers;
};

export interface BeforeRequestParams {
    /**
     * The request's target URL, including query parameters.
     *
     * This property can be changed by the interceptor.
     */
    target: URL;

    /**
     * The options that were used when the request was made.
     * Option values (such as headers) can be modified by an interceptor.
     */
    readonly options: ResolvedRequestOptions;

    /**
     * The context object holds arbitrary values associated with this http request.
     * Interceptors can read and modify values within this object.
     */
    readonly context: ContextData;

    /**
     * The signal can be used to listen for cancellation.
     * This is useful if an interceptor may run for a longer time.
     */
    readonly signal: AbortSignal;
}

export type ContextData = Record<string | symbol, unknown>;

/**
 * Http interceptors can intercept HTTP requests made by the {@link HttpService}.
 *
 * Interceptors can be used, for example, to add additional query parameters or http headers
 * or to manipulate a backend response.
 *
 * Use the interface name `http.Interceptor` to provide an implementation of this interface.
 */
export interface Interceptor extends DeclaredService<"http.Interceptor"> {
    beforeRequest?(params: BeforeRequestParams): void | Promise<void>;
}
