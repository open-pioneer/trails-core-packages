// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { getErrorChain } from "@open-pioneer/core";

export function logError(e: unknown) {
    if (e instanceof Error) {
        const chain = getErrorChain(e).reverse();
        if (chain.length === 1) {
            console.error(e);
            return;
        }

        let n = 1;
        for (const error of chain) {
            console.error(`#${n}`, error);
            ++n;
        }
    } else {
        console.error("Unexpected error", e);
    }
}
