// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

const documentedPackages = [
    "base-theme",
    "chakra-integration",
    "core",
    "http",
    "integration",
    "runtime",
    "test-utils",
];

// See https://typedoc.org/options/
module.exports = {
    "name": "Open Pioneer Core Packages",
    "readme": "none",
    "out": "dist/docs",
    "entryPointStrategy": "packages",
    "entryPoints": documentedPackages.map(p => `src/packages/${p}`),
    "skipErrorChecking": true,
    "validation": {
        "notExported": false,
        "invalidLink": true,
        "notDocumented": true
    }
};
