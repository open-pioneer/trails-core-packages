// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { throwAbortError, rethrowAbortError } from "@open-pioneer/core";
import { ServiceOptions } from "@open-pioneer/runtime";
import type {
    BeforeRequestParams,
    HttpService,
    HttpServiceRequestInit,
    Interceptor,
    ResolvedRequestOptions
} from "./api";

interface References {
    interceptors: Interceptor[];
}

export class HttpServiceImpl implements HttpService {
    #interceptors: [id: string, interceptor: Interceptor][];

    constructor(options: ServiceOptions<References>) {
        this.#interceptors = options.references.interceptors.map(
            (interceptor, index): [string, Interceptor] => {
                const id = options.referencesMeta.interceptors[index]!.serviceId;
                return [id, interceptor];
            }
        );
    }

    async fetch(
        resource: string | URL,
        init?: HttpServiceRequestInit | undefined
    ): Promise<Response> {
        const signal = init?.signal ?? undefined;
        const context = Object.assign({}, init?.context);
        const options = resolveOptions(init);
        checkAborted(signal);

        // Invoke request interceptors before the request is made.
        // Interceptors can modify the target URL and other request properties (such as headers).
        let target = getTargetUrl(resource);
        {
            const params: BeforeRequestParams = {
                target,
                signal: signal ?? new AbortController().signal,
                context,
                options
            };
            checkAborted(signal);
            await this.#invokeBeforeRequestInterceptors(params);
            target = params.target;
        }

        // Perform the actual request.
        const request = new Request(target, {
            ...options,
            signal
        });
        return await window.fetch(request);
    }

    async #invokeBeforeRequestInterceptors(params: BeforeRequestParams) {
        const { signal } = params;

        for (const [id, interceptor] of this.#interceptors) {
            checkAborted(signal);
            if (interceptor.beforeRequest) {
                // NOTE: may change 'params.target'
                try {
                    await interceptor.beforeRequest(params);
                } catch (e) {
                    rethrowAbortError(e);
                    throw new Error(`Interceptor '${id}' failed with an error`, { cause: e });
                }
            }
        }
    }
}

function getTargetUrl(rawTarget: string | URL): URL {
    if (typeof rawTarget === "string") {
        return new URL(rawTarget, window.location.href); // relative to current origin
    }
    return rawTarget;
}

function resolveOptions(init: HttpServiceRequestInit | undefined): ResolvedRequestOptions {
    const method = init?.method ?? "GET";
    const headers = new Headers(init?.headers ?? {});
    const options = {
        ...init,
        method,
        headers
    };
    for (const key in options) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (removeAttribute[key as keyof typeof removeAttribute]) {
            delete options[key as keyof typeof options];
        }
    }
    return options as ResolvedRequestOptions;
}

// Attributes that should be filtered because they should not be provided to interceptors
// via the `options` parameter.
const removeAttribute: Record<
    Exclude<keyof HttpServiceRequestInit, keyof ResolvedRequestOptions>,
    1
> = {
    context: 1,
    signal: 1
};

function checkAborted(signal: AbortSignal | undefined) {
    if (signal?.aborted) {
        throwAbortError();
    }
}
