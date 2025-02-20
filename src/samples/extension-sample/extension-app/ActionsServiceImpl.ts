// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Service, ServiceOptions } from "@open-pioneer/runtime";
import { Action, ActionProvider, ActionService } from "./api";

interface References {
    providers: ActionProvider[];
}

export class ActionServiceImpl implements Service<ActionService> {
    #actionsById = new Map<string, Action>();

    constructor(options: ServiceOptions<References>) {
        const actionsById = this.#actionsById;
        const providers = options.references.providers;
        for (const provider of providers) {
            const actions = provider.createActions();
            for (const action of actions) {
                if (actionsById.has(action.id)) {
                    throw new Error(`Action '${action.id}' was defined twice.`);
                }
                actionsById.set(action.id, action);
            }
        }
    }

    getActionInfo(): { id: string; text: string }[] {
        const info = Array.from(this.#actionsById.values()).map((action) => {
            return { id: action.id, text: action.text };
        });
        info.sort((a, b) => a.text.localeCompare(b.text));
        return info;
    }

    triggerAction(id: string): void {
        const action = this.#actionsById.get(id);
        if (!action) {
            throw new Error(`Action '${id}' was not defined.`);
        }
        action.trigger();
    }
}
