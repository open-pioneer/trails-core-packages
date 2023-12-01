// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
declare const INTERNAL_ASSOCIATED_SERVICE_METADATA: unique symbol;
declare const ERROR: unique symbol;

/**
 * Base interface for services that are associated with a well known interface name.
 *
 * By using this base interface, you can ensure that users of your interface use the correct interface name.
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
 * Given a type implementing {@link DeclaredService}, this type will produce the interface name associated with the service type.
 */
export type AssociatedInterfaceName<T extends DeclaredService<string>> = T extends DeclaredService<
    infer InterfaceName
>
    ? InterfaceName
    : never;

/**
 * This helper type produces the expected `interfaceName` (a string parameter) for the given service type.
 *
 * 1. If `ServiceType` is `unknown`, it will produce `string` to allow arbitrary parameters.
 * 2. If `ServiceType` implements {@link DeclaredService}, it will enforce the associated interface name.
 * 3. Otherwise, a compile time error is generated.
 */
export type InterfaceNameForServiceType<ServiceType> = unknown extends ServiceType
    ? string
    : ServiceType extends DeclaredService<string>
      ? AssociatedInterfaceName<ServiceType>
      : {
            [ERROR]: "TypeScript integration was not set up properly for this service. Make sure the service's TypeScript interface extends 'DeclaredService'.";
        };

/**
 * @internal
 */
interface ServiceMetadata<InterfaceName> {
    interfaceName: InterfaceName;
}
