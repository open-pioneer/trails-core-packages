// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { Error } from "@open-pioneer/core";
import { useContext, useMemo } from "react";
import { InterfaceNameForServiceType } from "../DeclaredService";
import { ErrorId } from "../errors";
import { PackageIntl } from "../i18n";
import { PackageContext, PackageContextMethods } from "./PackageContext";

/*

    IMPORTANT
    =========

    The functions in this file are part of the public API, although they should not be called directly.
    They are imported by code generated during separate package compilation generation via:

        import { hookName } from '@open-pioneer/runtime/react-integration'

    They are also imported by the vite plugin during development and when building an application.

    The matching exports are in the neighboring `index.ts`.
    The interfaces of these hooks must remain stable so that already published packages can continue to work in the future.

    See also the implementation of @open-pioneer/build-package.

*/

export interface UseServiceOptions {
    /** An additional qualifier to disambiguate service instances that implement the same interface. */
    qualifier?: string;
}

/**
 * Returns a service that implements the given interface.
 * Receives the package name of the importing package as a string.
 *
 * This is an internal hook that is typically called indirectly via the hook
 * provided from `"open-pioneer:react-hooks"`.
 *
 * @private
 */
export function useServiceInternal<ServiceType = unknown>(
    packageName: string,
    interfaceName: InterfaceNameForServiceType<ServiceType>,
    options?: UseServiceOptions
): ServiceType;
export function useServiceInternal(
    packageName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interfaceName: any,
    options?: UseServiceOptions
): unknown {
    const context = useContext(PackageContext);
    const service = useMemo(
        () =>
            checkContext("useService", context).getService(
                packageName,
                interfaceName,
                options ?? {}
            ),
        [context, packageName, interfaceName, options]
    );
    return service;
}

/**
 * Returns all services that implement the given interface.
 * Receives the package name of the importing package as a string.
 *
 * This is an internal hook that is typically called indirectly via the hook
 * provided from `"open-pioneer:react-hooks"`.
 *
 * @private
 */
export function useServicesInternal<ServiceType = unknown>(
    packageName: string,
    interfaceName: InterfaceNameForServiceType<ServiceType>,
    options?: UseServiceOptions
): ServiceType[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useServicesInternal(packageName: string, interfaceName: any): unknown[] {
    const context = useContext(PackageContext);
    const services = useMemo(
        () => checkContext("useServices", context).getServices(packageName, interfaceName),
        [context, packageName, interfaceName]
    );
    return services;
}

/**
 * Returns the properties for the given package.
 *
 * This is an internal hook that is typically called indirectly via the hook
 * provided from `"open-pioneer:react-hooks"`.
 *
 * @private
 */
export function usePropertiesInternal(packageName: string): Readonly<Record<string, unknown>> {
    const context = useContext(PackageContext);
    return checkContext("useProperties", context).getProperties(packageName);
}

/**
 * Returns the i18n object for the given package.
 *
 * This is an internal hook that is typically called indirectly via the hook
 * provided from `"open-pioneer:react-hooks"`.
 *
 * @private
 */
export function useIntlInternal(packageName: string): PackageIntl {
    const context = useContext(PackageContext);
    return checkContext("useIntl", context).getIntl(packageName);
}

function checkContext(
    hookName: string,
    contextData: PackageContextMethods | null
): PackageContextMethods {
    if (!contextData) {
        throw new Error(
            ErrorId.INTERNAL,
            `"Failed to access package context from '${hookName}': react integration was not set up properly.`
        );
    }
    return contextData;
}
