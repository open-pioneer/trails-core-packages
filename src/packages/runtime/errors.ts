// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
export enum ErrorId {
    // Problems with application metadata
    INVALID_METADATA = "runtime:invalid-metadata",
    INVALID_PROPERTY_NAME = "runtime:invalid-property-name",
    REQUIRED_PROPERTY = "runtime:required-property",

    // Application lifecycle
    NOT_MOUNTED = "runtime:element-not-mounted",
    UNSUPPORTED_LOCALE = "runtime:unsupported-locale",
    CONFIG_RESOLUTION_FAILED = "runtime:config-resolution-failed",
    INVALID_STATE = "runtime:invalid-state",

    // Service layer
    INTERFACE_NOT_FOUND = "runtime:interface-not-found",
    AMBIGUOUS_DEPENDENCY = "runtime:ambiguous-dependency",
    UNDECLARED_DEPENDENCY = "runtime:undeclared-dependency",
    MISSING_PACKAGE = "runtime:missing-package",
    SERVICE_CONSTRUCTION_FAILED = "runtime:service-construction-failed",
    SERVICE_DESTRUCTION_FAILED = "runtime:service-destruction-failed",
    DUPLICATE_INTERFACE = "runtime:duplicate-interface",
    DEPENDENCY_CYCLE = "runtime:dependency-cycle",

    // Web component API
    DUPLICATE_API_METHODS = "runtime:duplicate-api-methods",

    // Internal
    INTERNAL = "runtime:internal-error"
}
