// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { expect, it } from "vitest";
import { ErrorScreen, MESSAGES_BY_LOCALE } from "./ErrorScreen";
import { render, screen } from "@testing-library/react";
import { createPackageIntl } from "./i18n";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";

it("should successfully create an error screen component", async () => {
    const intl = createPackageIntl("en", MESSAGES_BY_LOCALE["en"]);
    const error = { name: "TestError", message: "test" };
    render(
        <PackageContextProvider>
            <div data-testid="error-screen">
                <ErrorScreen intl={intl} error={error} />
            </div>
        </PackageContextProvider>
    );
    const errorScreen = await screen.findByTestId("error-screen");

    expect(errorScreen).toMatchSnapshot();
});

it("should successfully create an error screen component with a stack trace", async () => {
    const intl = createPackageIntl("en", MESSAGES_BY_LOCALE["en"]);
    const error = { name: "TestError", message: "test", stack: "test stack trace" };
    render(
        <PackageContextProvider>
            <ErrorScreen intl={intl} error={error} />
        </PackageContextProvider>
    );
    const stackTraceDiv = document.getElementsByClassName("error-screen-stack-trace")[0];

    expect(stackTraceDiv).toBeDefined();
    expect(stackTraceDiv).toMatchSnapshot();
});
