// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { computed, ReadonlyReactive } from "@conterra/reactivity-core";
import { createLogger, NumberParser } from "@open-pioneer/core";
import { sourceId } from "open-pioneer:source-info";
import { LocaleService, NumberParserService } from "../api";
import { ServiceOptions } from "../Service";

const LOG = createLogger(sourceId);

interface ServiceReferences {
    localeService: Pick<LocaleService, "locale">;
}

export type NumberParserServiceOptions = ServiceOptions<ServiceReferences>;

export class NumberParserServiceImpl implements NumberParserService {
    #numberParser: ReadonlyReactive<NumberParser>;

    constructor(_serviceOptions: NumberParserServiceOptions) {
        const localeService = _serviceOptions.references.localeService;
        this.#numberParser = computed(() => {
            // reactive
            const tag = localeService.locale.baseName;
            try {
                return new NumberParser(tag);
            } catch (e) {
                LOG.warn(
                    `Failed to create NumberParser with locale '${tag}'. Falling back to 'en-US'.`,
                    e
                );
                return new NumberParser("en-US");
            }
        });
    }

    parseNumber(numberString: string): number {
        return this.#numberParser.value.parse(numberString);
    }
}
