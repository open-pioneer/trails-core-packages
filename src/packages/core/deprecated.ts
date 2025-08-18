// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
const PRINT_DEPRECATIONS =
    typeof __PRINT_DEPRECATIONS__ !== "undefined" ? __PRINT_DEPRECATIONS__ : true;

/**
 * Options supported by {@link deprecated}.
 */
export interface DeprecatedOptions {
    /**
     * The package that contains the deprecated entity.
     */
    packageName?: string;

    /**
     * The entity name (class name, function name, option, ...) that was deprecated.
     */
    name: string;

    /**
     * The version or date in which the entity was deprecated.
     */
    since: string;

    /**
     * Available alternatives, if any.
     * Should be a succinct message like `use xyz instead`.
     */
    alternative?: string;
}

/**
 * Creates a deprecation helper for a deprecated entity.
 *
 * This helper is used to print a deprecation warning to the browser console
 * when the deprecated functionality is being used.
 *
 * Returns a _function_ that should be called when the deprecated entity is being used.
 * The function will print a deprecation warning when usage is detected for the first time.
 * Any further calls will have no effect to prevent spamming the console.
 *
 * > NOTE: Deprecation warnings are only printed in development builds.
 *
 * Example:
 *
 * ```js
 * const printDeprecation = deprecated({
 *     name: "someFunctionName",
 *     packageName: "some-package",
 *     since: "v1.2.3",
 *     alternative: "use xyz instead"
 * });
 *
 * // Later, when the deprecated function is actually being used:
 * function someFunctionName() {
 *     printDeprecation();
 *     // ...
 * } *
 * ```
 */
export function deprecated(options: DeprecatedOptions): () => void {
    if (!PRINT_DEPRECATIONS || !import.meta.env.DEV) {
        return () => {}; // do nothing
    }

    let called = false;
    return function deprecationHelper() {
        if (called) {
            return;
        }

        called = true;
        console.warn(buildDeprecationWarning(options));
    };
}

function buildDeprecationWarning(options: DeprecatedOptions): string {
    const { packageName, name, since, alternative } = options;
    const packageInfo = packageName ? ` in ${packageName}` : "";
    const alternativeInfo = alternative ? `, ${alternative}` : "";
    const message = `⚠️ DEPRECATED: ${name}${packageInfo} (since ${since}${alternativeInfo}) - Please update your code as this may be removed in future versions.`;
    return message;
}
