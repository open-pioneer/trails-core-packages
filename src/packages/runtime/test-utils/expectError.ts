// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
export function expectError(impl: () => unknown): Error {
    try {
        impl();
        throw new Error("expected error!");
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error("unexpected error value, not an instance of Error");
    }
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
            throw new Error("unexpected error value, not an instance of Error");
        }
    );
}
