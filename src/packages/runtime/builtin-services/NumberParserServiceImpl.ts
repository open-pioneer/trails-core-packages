// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { NumberParserService } from "../api";
import { NumberParser } from "@open-pioneer/core/NumberParser";
import { ServiceOptions } from "../Service";
import { createLogger } from "@open-pioneer/core";

const LOG = createLogger("runtime:NumberParserService");

export class NumberParserServiceImpl implements NumberParserService {
    private numberParser: NumberParser;

    constructor(serviceOptions: ServiceOptions, locale: string) {
        try {
            this.numberParser = new NumberParser(locale);
        } catch (e) {
            LOG.warn(
                "Failed to create NumberParserImpl with locale. Retrying with default 'en-US' locale.",
                e
            );
            this.numberParser = new NumberParser("en-US");
        }
    }

    parseNumber(numberString: string): number {
        return this.numberParser.parse(numberString);
    }
}
