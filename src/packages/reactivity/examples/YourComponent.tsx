// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { useReactiveSnapshot } from "@open-pioneer/reactivity";
import { Model } from "./Model";

export interface YourComponentProps {
    // Some model class or interface based on the reactivity API.
    // In this case, the model has the properties `firstName` and `lastName`, both are (reactive) strings.
    model: Model;
}

export function YourComponent({ model }: YourComponentProps) {
    const fullName = useReactiveSnapshot(() => {
        // You can compute arbitrary values based on your model, even objects or array.
        // This callback is called whenever any dependency changed, this case if firstName or
        // lastName are updated.
        // Keep in mind that this callback should not have any side effects, because it may run any number of times.
        return `${model.firstName} ${model.lastName}`;
    }, [model]);

    // Name is automatically kept up-to-date.
    return <div>Hello {fullName}</div>;
}
