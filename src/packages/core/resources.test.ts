// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { expect, it } from "vitest";
import { destroyResources, Resource } from "./resources";

it("destroys all resources in the array", () => {
    const events: string[] = [];
    const resources: Resource[] = [
        {
            destroy() {
                events.push("destroyed 1");
            }
        },
        {
            destroy() {
                events.push("destroyed 2");
            }
        }
    ];

    destroyResources(resources);
    expect(events).toEqual(["destroyed 2", "destroyed 1"]); // reverse order
});

it("handles cycles correctly", () => {
    const events: string[] = [];
    const resources: Resource[] = [
        {
            destroy() {
                events.push("destroyed 1");
                destroyResources(resources); // still only destroys each resource only once
            }
        },
        {
            destroy() {
                events.push("destroyed 2");
            }
        }
    ];

    destroyResources(resources);
    expect(events).toEqual(["destroyed 2", "destroyed 1"]);
});
