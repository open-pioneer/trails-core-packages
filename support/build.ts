// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { build } from "@open-pioneer/build-package";
import { resolve } from "path";

const packages = ["chakra-integration", "core", "integration", "runtime", "test-utils"];

for (const pkg of packages) {
    const path = resolve(`src/packages/${pkg}`);
    await build({
        packageDirectory: path,
        validation: {
            requireChangelog: false,
            requireLicense: false
        }
    });
}
