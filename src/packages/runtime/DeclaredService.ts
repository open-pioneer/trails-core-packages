// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
declare const INTERNAL_ASSOCIATED_SERVICE_METADATA: unique symbol;
declare const ERROR: unique symbol;

/**
 * Base interface for services that are associated with a well known interface name.
 *
 * By using this base interface, you can ensure that users of your interface use the correct interface name.
 *
 * Note that this interface is a type level marker only.
 * It has no real associated methods or properties and it is not necessary to implement anything
 * to use this interface in a class.
 *
 * @example
 * ```ts
 * // MyLogger should be referenced via "my-package.Logger"
 * export interface MyLogger extends DeclaredService<"my-package.Logger"> {
 *     log(message: string): void;
 * }
 * ```
 *
 * > Note: TypeScript may list the `INTERNAL_ASSOCIATED_SERVICE_METADATA` property
 * > when generating the implementation for an interface extending this type.
 * > You can simply remove the offending line; it is not required (and not possible)
 * > to implement that attribute - it only exists for the compiler.
 */
export interface DeclaredService<InterfaceName extends string> {
    /**
     * Internal type-level service metadata.
     *
     * Note: there is no need to implement this symbol attribute.
     * It is optional and only exists for the compiler, never at runtime.
     *
     * @internal
     */
    [INTERNAL_ASSOCIATED_SERVICE_METADATA]?: ServiceMetadata<InterfaceName>;
}

/**
 * Helper symbol to declare a service's interface name when not using a separate interface.
 *
 * > NOTE: This symbol does not exist at runtime. Declaring a service interface is compile time only!
 * > It should therefore be imported via `import type` (see example below).
 *
 * @example
 *
 * ```ts
 * import { type DECLARE_SERVICE_INTERFACE} from "@open-pioneer/runtime";
 *
 * class MyServiceImpl {
 *     // Add this line to your class.
 *     // It declares (at compile time) that the service class must be used via the given interface name.
 *     // Note that the property is not really present at runtime.
 *     declare [DECLARE_SERVICE_INTERFACE]: "my-package.MyInterface";
 *
 *     method(): void {
 *         throw new Error("Method not implemented.");
 *     }
 * }
 * ```
 */
declare const DECLARE_SERVICE_INTERFACE: unique symbol;
export { type DECLARE_SERVICE_INTERFACE };

/**
 * Given a type implementing {@link DeclaredService} or using {@link DECLARE_SERVICE_INTERFACE},
 * this type will produce the interface name associated with the service type.
 */
export type AssociatedInterfaceName<T> =
    T extends DeclaredService<infer InterfaceName>
        ? InterfaceName
        : T extends { [DECLARE_SERVICE_INTERFACE]: string & infer InterfaceName }
          ? InterfaceName
          : never;

/**
 * This helper type produces the expected `interfaceName` (a string parameter) for the given service type.
 *
 * 1. If `ServiceType` is `unknown`, it will produce `string` to allow arbitrary parameters.
 * 2. If `ServiceType` implements {@link DeclaredService}, it will enforce the associated interface name.
 * 3. Otherwise, a compile time error is generated.
 */
export type InterfaceNameForServiceType<ServiceType> =
    IsUnknown<ServiceType> extends true
        ? string
        : AssociatedInterfaceName<ServiceType> extends never
          ? {
                [ERROR]: "TypeScript integration was not set up properly for this service. Make sure the service's TypeScript interface extends 'DeclaredService'.";
            }
          : AssociatedInterfaceName<ServiceType>;

/**
 * @internal
 */
interface ServiceMetadata<InterfaceName> {
    interfaceName: InterfaceName;
}

type IsUnknown<T> = unknown extends T ? ([T] extends [null] ? false : true) : false;
