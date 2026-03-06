// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createLogger } from "@open-pioneer/core";
import { ApiExtension } from "@open-pioneer/integration";
import { ServiceOptions } from "@open-pioneer/runtime";
import { sourceId } from "open-pioneer:source-info";
import { TextService } from "./TextService";

const LOG = createLogger(sourceId);

interface References {
    textService: TextService;
}

export class TextApiExtension implements ApiExtension {
    private textService: TextService;

    constructor(opts: ServiceOptions<References>) {
        this.textService = opts.references.textService;
    }

    async getApiMethods() {
        return {
            changeText: (text: string) => {
                LOG.info("Changing text to", JSON.stringify(text));
                this.textService.setText(text);
            }
        };
    }
}
