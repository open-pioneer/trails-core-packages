// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { createService } from "@open-pioneer/test-utils/services";
import { createElement } from "react";
import { expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { NotifierProperties } from "./api";
import { NotificationServiceImpl } from "./NotificationServiceImpl";
import { Notifier, NotifierProps } from "./Notifier";

it("shows notifications as toasts", async () => {
    const { service, content } = create();
    const screen = await render(content);

    service.notify({
        title: "test",
        // XXX: Cannot use jsx syntax here because it leads to an infinite recursion in zag-js??
        //      Only happens during testing.
        message: createElement(
            "span",
            {
                "data-testid": "notification-message"
            },
            "Message"
        )
    });

    const message = screen.getByTestId("notification-message");
    await expect.element(message).toBeVisible();
    await expect.element(screen.getByText("test", { exact: true })).toBeVisible();

    const toast = message.element().closest(".chakra-toast__root");
    expect(toast).not.toBeNull();
});

function create(options?: { componentProps?: NotifierProps; serviceProps?: NotifierProperties }) {
    const service = createService(NotificationServiceImpl, {
        properties: options?.serviceProps as any
    });
    const services = {
        "notifier.NotificationService": service
    };
    const content = (
        <PackageContextProvider services={services}>
            <Notifier {...options?.componentProps} />
        </PackageContextProvider>
    );
    return { service, content };
}
