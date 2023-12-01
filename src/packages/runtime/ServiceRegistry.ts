// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
// eslint-disable-next-line unused-imports/no-unused-imports
import { DeclaredService } from "./DeclaredService";
/**
 * Maps a registered interface name to a service type.
 * The interface can be reopened by client packages to add additional registrations.
 *
 * @example
 *
 * ```ts
 * import "@open-pioneer/runtime";
 * declare module "@open-pioneer/runtime" {
 *    interface ServiceRegistry {
 *        // Associates the interface name with the TypeScript interface
 *        "logging.LogService": Logger;
 *    }
 * }
 * ```
 *
 * @deprecated The global service registry is deprecated. Use {@link DeclaredService} in your service interface instead.
 *
 */
// TODO: Remove with next major
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceRegistry {}

/**
 * A well known interface name registered with the {@link ServiceRegistry}.
 *
 * @deprecated The global service registry is deprecated. Use {@link DeclaredService} in your service interface instead.
 */
// TODO: Remove with next major
export type InterfaceName = keyof ServiceRegistry;

/**
 * Returns the registered service type for the given interface name.
 *
 * @deprecated The global service registry is deprecated. Use {@link DeclaredService} in your service interface instead.
 */
// TODO: Remove with next major
export type ServiceType<I extends InterfaceName> = ServiceRegistry[I];
