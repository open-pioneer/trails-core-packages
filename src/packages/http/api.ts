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
     * This method works almost exactly the same as the browser's native `fetch` function.
     * However, certain trails extensions (such as interceptors) are implemented on top of `fetch`
     * to enable new features.
     *
     * For example, access tokens or other header / query parameters can be added automatically using an
     * interceptor if a package uses the `HttpService`.
     *
     * See also [fetch documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for reference.
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

/** Options passed to {@link Interceptor.beforeRequest}. */
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
 *
 * > Note that the request interceptor API is experimental: it may change with a new minor release as a response to feedback.
 */
export interface Interceptor extends DeclaredService<"http.Interceptor"> {
    /**
     * This method will be invoked for every request made by the {@link HttpService}.
     *
     * The `params` passed to the interceptor method can be inspected and can also be updated to change how the request is going to be made.
     * For example, `target` and `options.headers` can be modified.
     *
     * The method implementation can be asynchronous.
     *
     * > NOTE: There may be more than one interceptor in an application.
     * > All interceptors are invoked for every request.
     * > The order in which the interceptors are invoked is currently not defined.
     */
    beforeRequest?(params: BeforeRequestParams): void | Promise<void>;
}
