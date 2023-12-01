// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@open-pioneer/vite-plugin-pioneer/client" />

// TODO: Release vite plugin pioneer and update typings.
// The declarations here should move into the client.d.ts in that plugin.
// This section can then be removed.
declare module "open-pioneer:react-hooks" {
    import type { InterfaceNameForServiceType } from "@open-pioneer/runtime";
    import type { UseServiceOptions } from "@open-pioneer/runtime/react-integration";
    export { type UseServiceOptions };

    /**
     * Returns an implementation of the given interface.
     *
     * A complete interface name is required (e.g. "logging.LogService").
     *
     * In order to use a service, it must be declared as an UI-dependency in the package's configuration file.
     *
     * Example:
     *
     * ```ts
     * const service = useService<MyInterface>("my-package.MyInterface");
     * ```
     */
    export function useService<ServiceType = unknown>(
        interfaceName: InterfaceNameForServiceType<ServiceType>,
        options?: UseServiceOptions
    ): ServiceType;

    /**
     * Returns all implementations of the given interface.
     *
     * A complete interface name is required (e.g. "logging.LogService").
     *
     * In order to use all services, it must be declared as an UI-dependency (`all: true`) in the package's configuration file.
     *
     * Example:
     *
     * ```ts
     * const services = useServices<MyInterface>("my-package.MyInterface");
     * ```
     */
    export function useServices<ServiceType = unknown>(
        interfaceName: InterfaceNameForServiceType<ServiceType>,
        options?: UseServiceOptions
    ): ServiceType[];
}
