// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
export interface ManualPromise<T> {
    promise: Promise<T>;
    resolve(value: T): void;
    reject(error: unknown): void;
}

export function createManualPromise<T>(): ManualPromise<T> {
    let resolve!: (value: T) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve,
        reject
    };
}
