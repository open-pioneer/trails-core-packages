// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { it, expect } from "vitest";
import { createService } from "@open-pioneer/test-utils/services";
import { NotificationServiceImpl, Notification } from "./NotificationServiceImpl";

it("dispatches events to the notification handler", async () => {
    const service = await createService(NotificationServiceImpl, {});
    const events: unknown[] = [];
    const handlerResource = service.registerHandler({
        showNotification(notification: Notification) {
            events.push({ type: "notification", notification: notification });
        },
        closeAll() {
            events.push({ type: "closeAll" });
        }
    });

    service.notify({ title: "test" });
    expect(events).toMatchInlineSnapshot(`
      [
        {
          "notification": {
            "displayDuration": undefined,
            "level": "info",
            "message": undefined,
            "title": "test",
          },
          "type": "notification",
        },
      ]
    `);

    events.splice(0, events.length);

    service.closeAll();
    expect(events).toMatchInlineSnapshot(`
      [
        {
          "type": "closeAll",
        },
      ]
    `);

    events.splice(0, events.length);

    handlerResource.destroy();
    service.closeAll();
    expect(events).toHaveLength(0);
});

it("dispatches events with convenience methods with object parameter", async () => {
    const service = await createService(NotificationServiceImpl, {});
    const events: unknown[] = [];
    service.registerHandler({
        showNotification(notification: Notification) {
            events.push(notification);
        },
        closeAll() {}
    });

    service.success({ title: "test1" });
    service.info({ title: "test2" });
    service.warning({ title: "test3" });
    service.error({ title: "test4" });

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "displayDuration": undefined,
          "level": "success",
          "message": undefined,
          "title": "test1",
        },
        {
          "displayDuration": undefined,
          "level": "info",
          "message": undefined,
          "title": "test2",
        },
        {
          "displayDuration": undefined,
          "level": "warning",
          "message": undefined,
          "title": "test3",
        },
        {
          "displayDuration": undefined,
          "level": "error",
          "message": undefined,
          "title": "test4",
        },
      ]
    `);
});

it("dispatches events with convenience methods with string parameter", async () => {
    const service = await createService(NotificationServiceImpl, {});
    const events: unknown[] = [];
    service.registerHandler({
        showNotification(notification: Notification) {
            events.push(notification);
        },
        closeAll() {}
    });

    service.success("test1");
    service.info("test2");
    service.warning("test3");
    service.error("test4");

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "displayDuration": undefined,
          "level": "success",
          "message": "test1",
          "title": undefined,
        },
        {
          "displayDuration": undefined,
          "level": "info",
          "message": "test2",
          "title": undefined,
        },
        {
          "displayDuration": undefined,
          "level": "warning",
          "message": "test3",
          "title": undefined,
        },
        {
          "displayDuration": undefined,
          "level": "error",
          "message": "test4",
          "title": undefined,
        },
      ]
    `);
});

it("dispatches events to a later registered notification handler", async () => {
    const service = await createService(NotificationServiceImpl, {});
    const events: unknown[] = [];
    service.notify({ title: "test" });
    service.closeAll();
    service.notify({ title: "test2" });

    service.registerHandler({
        showNotification(notification: Notification) {
            events.push({ type: "notification", notification: notification });
        },
        closeAll() {
            events.push({ type: "closeAll" });
        }
    });

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "notification": {
            "displayDuration": undefined,
            "level": "info",
            "message": undefined,
            "title": "test",
          },
          "type": "notification",
        },
        {
          "type": "closeAll",
        },
        {
          "notification": {
            "displayDuration": undefined,
            "level": "info",
            "message": undefined,
            "title": "test2",
          },
          "type": "notification",
        },
      ]
    `);
});
