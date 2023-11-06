// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { IntlErrorCode, OnErrorFn } from "@formatjs/intl";

/** Hides missing translation errors during tests */
export const INTL_ERROR_HANDLER: OnErrorFn = (err) => {
    if (err.code === IntlErrorCode.MISSING_TRANSLATION) {
        return;
    }

    console.error(err);
};
