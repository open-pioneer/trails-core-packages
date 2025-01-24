// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ApplicationContext } from "@open-pioneer/runtime";
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { createService } from "@open-pioneer/test-utils/services";
import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { createElement } from "react";
import { expect, it } from "vitest";
import { NotificationServiceImpl } from "./NotificationServiceImpl";
import { Notifier } from "./Notifier";

it("shows notifications as toasts", async () => {
    const { service, content } = await create();
    render(content);

    act(() => {
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
    });

    const messageDiv = await screen.findByTestId("notification-message", {});
    const toastElement = findToastRoot(messageDiv);

    expect(toastElement).toMatchSnapshot();
});

it("closes all notifications", async () => {
    const { service, content } = await create();
    render(content);

    act(() => {
        service.notify({ title: "test1" });
        service.notify({ title: "test1" });
        service.notify({ title: "test1" });
    });

    const messageElements = await waitFor(async () => {
        const messageElements = await screen.findAllByText("test1");
        if (messageElements.length !== 3) {
            throw new Error("Did not open three notifications");
        }
        return messageElements;
    });
    expect(messageElements).toHaveLength(3);

    act(() => {
        service.closeAll();
    });
    await waitForElementToBeRemoved(messageElements);
    const messageElementsAfterClear = await screen.queryAllByText("test1");
    expect(messageElementsAfterClear).toHaveLength(0);
});

async function create() {
    const service = await createService(NotificationServiceImpl, {
        references: {
            appCtx: {
                getShadowRoot() {
                    return document as any;
                }
            } satisfies Partial<ApplicationContext>
        }
    });
    const services = {
        "notifier.NotificationService": service
    };
    const content = (
        <PackageContextProvider services={services}>
            <Notifier />
        </PackageContextProvider>
    );
    return { service, content };
}

function findToastRoot(messageDiv: HTMLElement) {
    let currentElement = messageDiv.parentElement;
    while (currentElement) {
        if (currentElement.classList.contains("chakra-toast__root")) {
            return currentElement;
        } else {
            currentElement = currentElement.parentElement;
        }
    }
    return undefined;
}
