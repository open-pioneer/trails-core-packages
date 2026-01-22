// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { PackageContextProvider } from "@open-pioneer/test-utils/react";
import { createService } from "@open-pioneer/test-utils/services";
import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { createElement } from "react";
import { expect, it } from "vitest";
import { NotificationServiceImpl } from "./NotificationServiceImpl";
import { Notifier, NotifierProps } from "./Notifier";
import { NotifierProperties, OffsetsObject } from "./api";

it("shows notifications as toasts", async () => {
    const { service, content } = create();
    render(content);
    await screen.findByRole("region"); // Wait for mount

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
    const { service, content } = create();
    render(content);
    await screen.findByRole("region"); // Wait for mount

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
    const messageElementsAfterClear = screen.queryAllByText("test1");
    expect(messageElementsAfterClear).toHaveLength(0);
});

it("supports custom props on <Notifier/>", async () => {
    const { content } = create({
        componentProps: {
            rootProps: {
                fontSize: "123px"
            }
        }
    });
    render(content);

    const rootDiv = await screen.findByRole("region"); // Wait for mount
    expect(rootDiv.tagName).toBe("DIV");
    expect(rootDiv).toHaveStyle({
        "font-size": "123px"
    });
});

it("supports custom positions", async () => {
    const { content } = create({
        serviceProps: {
            position: "bottom-right"
        }
    });
    render(content);

    const rootDiv = await screen.findByRole("region"); // Wait for mount
    const placement = rootDiv.getAttribute("data-placement");
    expect(placement).toBe("bottom-end"); // Technically chakra internal
});

it("supports custom offsets (equal on each side)", async () => {
    const { content } = create({
        serviceProps: {
            offsets: "5 px"
        }
    });
    render(content);

    const rootDiv = await screen.findByRole("region"); // Wait for mount

    // Chakra currently applies the offset via css variables.
    // Browser tests would allow for a better test (e.g. actual position of a toast).
    expect(getOffset(rootDiv, "left")).toMatchInlineSnapshot(`"5 px"`);
    expect(getOffset(rootDiv, "top")).toMatchInlineSnapshot(`"5 px"`);
    expect(getOffset(rootDiv, "right")).toMatchInlineSnapshot(`"5 px"`);
    expect(getOffset(rootDiv, "bottom")).toMatchInlineSnapshot(`"5 px"`);
});

it("supports custom offsets (custom for each side)", async () => {
    const { content } = create({
        serviceProps: {
            offsets: {
                left: "1 px",
                top: "2 px",
                right: "3 px",
                bottom: "4 px"
            }
        }
    });
    render(content);

    const rootDiv = await screen.findByRole("region"); // Wait for mount

    // Chakra currently applies the offset via css variables.
    // Browser tests would allow for a better test (e.g. actual position of a toast).
    expect(getOffset(rootDiv, "left")).toMatchInlineSnapshot(`"1 px"`);
    expect(getOffset(rootDiv, "top")).toMatchInlineSnapshot(`"2 px"`);
    expect(getOffset(rootDiv, "right")).toMatchInlineSnapshot(`"3 px"`);
    expect(getOffset(rootDiv, "bottom")).toMatchInlineSnapshot(`"4 px"`);
});

it("throws an error if offsets are missing", async () => {
    expect(() =>
        create({
            serviceProps: {
                offsets: {
                    left: "1 px",
                    top: "2 px",
                    bottom: "4 px"
                } as unknown as OffsetsObject
            }
        })
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Offset 'right' is required.]`);
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

function getOffset(element: HTMLElement, side: "left" | "top" | "right" | "bottom") {
    return element.style.getPropertyValue(`--viewport-offset-${side}`);
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
