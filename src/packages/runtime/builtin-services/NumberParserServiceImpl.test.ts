// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { ServiceOptions } from "../Service";
import { createCustomElement } from "../CustomElement";
import { renderComponentShadowDOM } from "@open-pioneer/test-utils/web-components";
import { NumberParserServiceImpl } from "./NumberParserServiceImpl";

it("can use the NumberParserService to parse a string to a number", async function () {
    const parsedNumber = await parseNumberWithLocale("123.45", "en-US");
    expect(parsedNumber).toBe(123.45);
});

it("can use the NumberParserService to parse a string to a number if local is 'de'", async function () {
    const parsedNumber = await parseNumberWithLocale("123.123,2", "de");
    expect(parsedNumber).toBe(123123.2);
});

async function parseNumberWithLocale(numberString: string, locale: string) {
    let parsedNumber: number | undefined;

    class TestService {
        constructor(options: ServiceOptions<{ numberParser: NumberParserServiceImpl }>) {
            const numberParser = options.references.numberParser;
            parsedNumber = numberParser.parseNumber(numberString);
        }
    }

    const elem = createCustomElement({
        appMetadata: {
            packages: {
                test: {
                    name: "test",
                    services: {
                        testService: {
                            name: "testService",
                            clazz: TestService,
                            references: {
                                numberParser: {
                                    name: "runtime.NumberParserService"
                                }
                            },
                            provides: [{ name: "runtime.AutoStart" }]
                        }
                    }
                }
            },
            locales: [locale]
        },
        config: {
            locale: locale
        }
    });

    await renderComponentShadowDOM(elem);
    return parsedNumber;
}
