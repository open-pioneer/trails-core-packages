// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

import { ApiExtension } from "@open-pioneer/integration";

export class SecondApiExtension implements ApiExtension {
    async getApiMethods() {
        return {
            justAnotherApiMethod: () => {
                console.log("justAnotherApiMethod");
            }
        };
    }
}
