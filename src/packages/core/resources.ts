// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
/**
 * An object that has some cleanup code associated with it.
 */
export interface Resource {
    /** A function that releases any state held by the resource. */
    destroy(): void;
}

/**
 * A helper function that invokes `destroy()` on the given resource and returns undefined.
 *
 * Example:
 *
 * ```js
 * class Holder {
 *    private myResource: Resource | undefined;
 *
 *    destroy() {
 *        this.myResource = destroyResource(this.myResource);
 *    }
 * }
 * ```
 */
export function destroyResource<R extends Resource>(resource: R | undefined): undefined {
    resource?.destroy();
    return undefined;
}

/**
 * A helper function that invokes `destroy()` on each resource in the given array.
 *
 * This function destroys the resources in reverse order (starting from the last element).
 * This is done to reverse the order of construction.
 *
 * The array will be cleared by this function.
 */
export function destroyResources<R extends Resource>(resources: R[]): void {
    // `destroy()` might call us in a cycle, so we modify the array in place.
    let resource: Resource | undefined;
    while ((resource = resources.pop())) {
        resource.destroy();
    }
}
