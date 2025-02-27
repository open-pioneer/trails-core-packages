// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
const GlobalError = globalThis.Error;

/**
 * A custom error class that enforces the use of error ids.
 *
 * An error must be constructed from a (computer-readable) id and a human readable informational text.
 * An optional `cause` option can be passed to indicate the nested reason for an error.
 *
 * # Conventions
 *
 * Error ids should be scoped to a package to avoid conflicts.
 * Each package should pick a sensible namespace prefix.
 *
 * An example for a good error id is `runtime:dependency-cycle`.
 */
export class Error extends GlobalError {
    /** Unique error id */
    public readonly id: string;

    /** Human readable error message */
    public readonly text: string;

    constructor(id: string, text: string, options?: { cause?: unknown }) {
        super(`${id}: ${text}`, options);
        this.id = id;
        this.text = text;
    }
}

/**
 * Returns the error chain for the given `err`, starting with this error.
 * The error chain contains the error itself and all its causes.
 * The first entry is `err` itself.
 */
export function getErrorChain(err: globalThis.Error): globalThis.Error[] {
    const chain: globalThis.Error[] = [];
    do {
        chain.push(err);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cause = (err as any).cause as unknown;
        if (!(cause instanceof GlobalError)) {
            break;
        }
        err = cause;
    } while (1); // eslint-disable-line no-constant-condition
    return chain;
}

/**
 * Returns true if the error represents an abort error.
 */
export function isAbortError(err: unknown): boolean {
    return !!(err && typeof err === "object" && "name" in err && err.name === "AbortError");
}

/**
 * Throws an abort error (`.name` === `"AbortError"`).
 */
export function throwAbortError(): never {
    throw createAbortError();
}

/**
 * Throws `err` if it is an abort error. Does nothing otherwise.
 */
export function rethrowAbortError(err: unknown): void {
    if (isAbortError(err)) {
        throw err;
    }
}

/**
 * Returns an abort error (`.name` === `"AbortError"`).
 */
export function createAbortError(): globalThis.Error {
    const err = new globalThis.Error("Aborted");
    err.name = "AbortError";
    return err;
}
