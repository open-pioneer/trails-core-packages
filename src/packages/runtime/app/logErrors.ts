// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { getErrorChain, createLogger } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";

const LOG = createLogger(sourceId);

export function logError(e: unknown) {
    if (e instanceof Error) {
        const chain = getErrorChain(e).reverse();
        if (chain.length === 1) {
            LOG.error(e);
            return;
        }

        let n = 1;
        for (const error of chain) {
            LOG.error(`#${n}`, error);
            ++n;
        }
    } else {
        LOG.error("Unexpected error", e);
    }
}
