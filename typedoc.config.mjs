// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { readFileSync } from "fs";
import fastGlob from "fast-glob";
import { dirname } from "path";
import { OptionDefaults } from "typedoc";

const DEFAULT_HIGHLIGHT_LANGS = OptionDefaults.highlightLanguages;

const documentedPackages = getPackageDirectories().sort();
console.info("Creating documentation for packages:", documentedPackages);

// See https://typedoc.org/options/
export default {
    name: "Trails Packages",
    readme: "none",
    out: "dist/docs",
    entryPointStrategy: "packages",
    entryPoints: documentedPackages,
    skipErrorChecking: true,

    // 'tsx' is in default, but 'jsx' is not..
    highlightLanguages: [...DEFAULT_HIGHLIGHT_LANGS, "jsx"]
};

function getPackageDirectories() {
    const packageJsonPaths = fastGlob.sync("./src/packages/**/package.json", {
        ignore: ["**/dist/**", "**/node_modules/**", "**/test-data/**"],
        followSymbolicLinks: false
    });
    const packageDirectories = packageJsonPaths
        .filter((path) => {
            const packageJsonContent = JSON.parse(readFileSync(path, "utf-8"));
            const isPrivate = !!packageJsonContent.private;
            return !isPrivate;
        })
        .map((path) => dirname(path));
    return packageDirectories;
}
