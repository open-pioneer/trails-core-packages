// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { defineBuildConfig } from "@open-pioneer/build-support";

export default defineBuildConfig({
    entryPoints: [
        "index",
        // Needed for build plugin
        "metadata/index",
        // Needed for react hooks and test utils
        "react-integration/index"
    ]
});
