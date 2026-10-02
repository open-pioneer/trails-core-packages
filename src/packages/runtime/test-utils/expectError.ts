// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

export function expectError(impl: () => unknown): Error {
    let didThrow = false;
    let thrown: unknown;
    try {
        impl();
    } catch (e) {
        didThrow = true;
        thrown = e;
    }
    if (!didThrow) {
        throw new Error("expected error!");
    }
    if (thrown instanceof Error) {
        return thrown;
    }
    throw new Error("unexpected error value, not an instance of Error", { cause: thrown });
}

export function expectAsyncError(impl: () => Promise<unknown>): Promise<Error> {
    const promise = impl();
    return promise.then(
        () => {
            throw new Error("expected error!");
        },
        (e) => {
            if (e instanceof Error) {
                return e;
            }
            throw new Error("unexpected error value, not an instance of Error", { cause: e });
        }
    );
}
