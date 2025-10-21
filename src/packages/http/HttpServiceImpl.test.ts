// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
/**
 * @vitest-environment happy-dom
 */
import { isAbortError, throwAbortError } from "@open-pioneer/core";
import { createService } from "@open-pioneer/test-utils/services";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpServiceImpl } from "./HttpServiceImpl";
import { Interceptor } from "./api";

afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});

it("should invoke fetch", async () => {
    const { service, getRequestCount, getLastRequest } = setup();
    const response = await service.fetch("https://example.com/foo?bar=baz");

    expect(getRequestCount()).toBe(1);
    expect(getLastRequest()?.url).toMatchInlineSnapshot('"https://example.com/foo?bar=baz"');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
});

it("transports request errors", async () => {
    const { service } = setup({ fetchResponse: errorResponse(404) });
    const response = await service.fetch("https://example.com");
    expect(response.status).toBe(404);
});

it("performs requests relative to the current origin", async () => {
    const { service, getLastRequest } = setup({
        location: "https://example.com/some/path"
    });
    await service.fetch("/foo?bar=baz");

    expect(getLastRequest()?.url).toMatchInlineSnapshot('"https://example.com/foo?bar=baz"');
});

it("performs requests relative to the current location", async () => {
    const { service, getLastRequest } = setup({
        location: "https://example.com/some/path/index.html"
    });
    await service.fetch("./foo?bar=baz");

    expect(getLastRequest()?.url).toMatchInlineSnapshot(
        '"https://example.com/some/path/foo?bar=baz"'
    );
});

it("supports cancellation", async () => {
    const abortController = new AbortController();
    const { service } = setup({
        async fetchResponse(req) {
            await waitForAbort(req.signal);
            throwAbortError();
        }
    });

    const promise = service.fetch("./foo?bar=baz", { signal: abortController.signal });
    abortController.abort();
    await expect(promise).rejects.toSatisfy(isAbortError);
});

describe("before request interceptors", () => {
    it("invokes interceptors in order", async () => {
        const events: string[] = [];
        const interceptors: Interceptor[] = [
            {
                beforeRequest({ target }) {
                    events.push("1: " + target.href);
                }
            },
            {
                beforeRequest({ target }) {
                    events.push("2: " + target.href);
                }
            }
        ];
        const { service } = setup({ interceptors });
        await service.fetch("https://example.com");
        expect(events).toMatchInlineSnapshot(`
          [
            "1: https://example.com/",
            "2: https://example.com/",
          ]
        `);
    });

    it("supports asynchronous interceptors", async () => {
        vi.useFakeTimers();

        const timeout = 5000;
        const interceptor: Interceptor = {
            async beforeRequest(params) {
                await new Promise((resolve) => {
                    setTimeout(resolve, timeout);
                });

                params.target = new URL("https://foo.bar/other-path");
            }
        };
        const { service, getLastRequest } = setup({ interceptors: [interceptor] });
        const promise = service.fetch("https://example.com/bar");
        vi.advanceTimersByTime(timeout);
        await promise;
        expect(getLastRequest()?.url).toMatchInlineSnapshot('"https://foo.bar/other-path"');
    });

    it("allows interceptors to add query parameters", async () => {
        const interceptor: Interceptor = {
            beforeRequest(params) {
                params.target.searchParams.append("token", "foo");
            }
        };
        const { service, getLastRequest } = setup({ interceptors: [interceptor] });
        await service.fetch("https://example.com/bar");
        expect(getLastRequest()?.url).toMatchInlineSnapshot('"https://example.com/bar?token=foo"');
    });

    it("allows interceptors to replace the target URL", async () => {
        const interceptor: Interceptor = {
            beforeRequest(params) {
                params.target = new URL("https://foo.bar/other-path");
            }
        };
        const { service, getLastRequest } = setup({ interceptors: [interceptor] });
        await service.fetch("https://example.com/bar");
        expect(getLastRequest()?.url).toMatchInlineSnapshot('"https://foo.bar/other-path"');
    });

    it("allows interceptors to add custom http headers", async () => {
        const interceptor: Interceptor = {
            beforeRequest(params) {
                params.options.headers.set("X-CUSTOM-TOKEN", "1234");
            }
        };
        const { service, getLastRequest } = setup({ interceptors: [interceptor] });
        await service.fetch("https://example.com/bar");

        const lastRequest = getLastRequest();
        expect(lastRequest?.headers.get("X-CUSTOM-TOKEN")).toBe("1234");
    });

    it("allows interceptors to modify various request options", async () => {
        const interceptor: Interceptor = {
            beforeRequest(params) {
                params.options.credentials = "include";
                params.options.method = "PUT";
            }
        };
        const { service, getLastRequest } = setup({ interceptors: [interceptor] });
        await service.fetch("https://example.com/");

        const lastRequest = getLastRequest();
        expect(lastRequest?.credentials).toBe("include");
        expect(lastRequest?.method).toBe("PUT");
    });

    it("supports per-request context properties", async () => {
        const symbol = Symbol("some_symbol");
        const props: Record<string | symbol, unknown> = {};
        const { service } = setup({
            interceptors: [
                {
                    beforeRequest({ context }) {
                        props["symbol_prop"] = context[symbol];
                        props["string_prop"] = context["foo"];
                    }
                }
            ]
        });

        await service.fetch("https://example.com", {
            context: {
                [symbol]: "SYMBOL",
                foo: "STRING"
            }
        });

        expect(props).toMatchInlineSnapshot(`
          {
            "string_prop": "STRING",
            "symbol_prop": "SYMBOL",
          }
        `);
    });

    it("allows mutation of context from inside interceptors", async () => {
        const values: unknown[] = [];
        const interceptor: Interceptor = {
            beforeRequest({ context }) {
                const existing = context.value;
                values.push(existing);

                context.value = typeof existing === "number" ? existing + 1 : 0;
            }
        };
        const { service } = setup({
            interceptors: [interceptor, interceptor, interceptor, interceptor]
        });
        await service.fetch("https://example.com");
        expect(values).toMatchInlineSnapshot(`
          [
            undefined,
            0,
            1,
            2,
          ]
        `);
    });

    it("allows interceptors to spawn another request", async () => {
        let calls = 0;
        const interceptor: Interceptor = {
            async beforeRequest({ context }) {
                ++calls;

                if (context.skipRecurse) {
                    return;
                }

                await service.fetch("https://example.com/second", {
                    context: {
                        skipRecurse: true
                    }
                });
            }
        };

        const { service, getRequests } = setup({ interceptors: [interceptor] });
        await service.fetch("https://example.com/first");

        expect(calls).toBe(2);
        expect(getRequests().map((r) => r.url)).toMatchInlineSnapshot(`
          [
            "https://example.com/second",
            "https://example.com/first",
          ]
        `);
    });
});

function setup(options?: {
    fetchResponse?: Response | ((req: Request) => Response | Promise<Response>);
    location?: string;
    interceptors?: Interceptor[];
}) {
    const requests: Request[] = [];
    const fetchImpl = vi.fn().mockImplementation(async (req: Request) => {
        requests.push(req);

        const response = options?.fetchResponse;
        if (!response) {
            return okResponse();
        }
        return typeof response === "function" ? await response(req) : response;
    });

    vi.spyOn(window, "fetch" as any, "get").mockReturnValue(fetchImpl as any);
    vi.spyOn(window.location, "href", "get").mockReturnValue(
        options?.location ?? "https://example.com:3000/"
    );

    const service = createService(HttpServiceImpl, {
        references: {
            interceptors: options?.interceptors ?? []
        }
    });
    return {
        service,
        getRequests() {
            return requests;
        },
        getRequestCount() {
            return requests.length;
        },
        getLastRequest() {
            return requests[requests.length - 1];
        }
    };
}

function waitForAbort(signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
        if (signal.aborted) {
            return resolve();
        }

        const handler = () => {
            signal.removeEventListener("abort", handler);
            resolve();
        };
        signal.addEventListener("abort", handler);
    });
}

function okResponse() {
    return new Response("ok", {
        status: 200,
        statusText: "OK"
    });
}

function errorResponse(code = 404) {
    return new Response("error´", {
        status: code
    });
}
