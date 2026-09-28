// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { createLogger } from "@open-pioneer/core";
import { ServiceOptions } from "@open-pioneer/runtime";
import { sourceId } from "open-pioneer:source-info";
import { SessionStorageService } from "./api";
import { StorageServiceImpl } from "./StorageServiceImpl";

const LOG = createLogger(sourceId);

/** Implements the {@link SessionStorageService} on top of the browser's `sessionStorage`. */
export class SessionStorageServiceImpl extends StorageServiceImpl implements SessionStorageService {
    constructor(options: ServiceOptions) {
        super(options, {
            log: LOG,
            label: "session storage",
            getStorage: () => globalThis.sessionStorage
        });
    }
}
