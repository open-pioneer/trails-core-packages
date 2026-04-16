// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { reactive, ReadonlyReactive } from "@conterra/reactivity-core";

// TODO: Remove if https://github.com/conterra/reactivity/issues/77 is available
export function reactiveConstant<T>(value: T): ReadonlyReactive<T> {
    return reactive(value);
}
