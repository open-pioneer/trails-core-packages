// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive } from "@conterra/reactivity-core";

export class Model {
    // Private storage. Signals are not exposed in this example.
    #firstName = reactive("John");
    #lastName = reactive("Doe");

    // Public getters to access the current values, with a convenient API.
    get firstName(): string {
        return this.#firstName.value;
    }

    get lastName(): string {
        return this.#lastName.value;
    }

    // Update the name values.
    // Any UI connected to the model via useReactiveSnapshot() will automatically update.
    updateName(newFirstName: string, newLastName: string): void {
        this.#firstName.value = newFirstName;
        this.#lastName.value = newLastName;
    }
}
