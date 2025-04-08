// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    entryPoints: [
        "index",
        // Needed for build plugin
        "metadata/index",
        // Needed for react hooks and @open-pioneer/test-utils
        "react-integration/index",
        // Needed for @open-pioneer/test-utils
        "test-support/index"
    ]
});
