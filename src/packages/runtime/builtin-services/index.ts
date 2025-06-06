// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createEmptyPackageIntl } from "../i18n";
import { PackageRepr } from "../service-layer/PackageRepr";
import {
    createConstructorFactory,
    createFunctionFactory,
    ServiceRepr
} from "../service-layer/ServiceRepr";
import { ApiServiceImpl } from "./ApiServiceImpl";
import { ApplicationContextImpl, ApplicationContextProperties } from "./ApplicationContextImpl";
import { ApplicationLifecycleEventService } from "./ApplicationLifecycleEventService";
import { NumberParserServiceImpl } from "./NumberParserServiceImpl";

export const RUNTIME_PACKAGE_NAME = "@open-pioneer/runtime";
export const RUNTIME_API_EXTENSION = "integration.ApiExtension";
export const RUNTIME_API_SERVICE = "runtime.ApiService";
export const RUNTIME_APPLICATION_CONTEXT = "runtime.ApplicationContext";
export const RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE =
    "runtime.ApplicationLifecycleEventService";
export const RUNTIME_NUMBER_PARSER_SERVICE = "runtime.NumberParserService";
export const RUNTIME_AUTO_START = "runtime.AutoStart";

export type BuiltinPackageProperties = ApplicationContextProperties;

/**
 * Creates the builtin package containing the builtin services.
 *
 * The runtime package should not use services in the `build.config.mjs`
 * for a clean bootstrapping procedure (it will be instantiated without
 * generated application metadata in tests).
 *
 * This function is called as part of the service layer startup.
 * The package produced here is always part of the application.
 */
export function createBuiltinPackage(properties: BuiltinPackageProperties): PackageRepr {
    const i18n = createEmptyPackageIntl();
    const apiService = new ServiceRepr({
        name: "ApiServiceImpl",
        packageName: RUNTIME_PACKAGE_NAME,
        factory: createConstructorFactory(ApiServiceImpl),
        intl: i18n,
        interfaces: [
            {
                interfaceName: RUNTIME_API_SERVICE,
                qualifier: "builtin"
            }
        ],
        dependencies: [
            {
                referenceName: "providers",
                interfaceName: RUNTIME_API_EXTENSION,
                all: true
            }
        ]
    });
    const appContext = new ServiceRepr({
        name: "ApplicationContextImpl",
        packageName: RUNTIME_PACKAGE_NAME,
        factory: createFunctionFactory(
            (options) => new ApplicationContextImpl(options, properties)
        ),
        intl: i18n,
        interfaces: [
            {
                interfaceName: RUNTIME_APPLICATION_CONTEXT,
                qualifier: "builtin"
            }
        ]
    });
    const lifecycleEventService = new ServiceRepr({
        name: "ApplicationLifecycleEventServiceImpl",
        packageName: RUNTIME_PACKAGE_NAME,
        factory: createConstructorFactory(ApplicationLifecycleEventService),
        intl: i18n,
        interfaces: [
            {
                interfaceName: RUNTIME_APPLICATION_LIFECYCLE_EVENT_SERVICE,
                qualifier: "builtin"
            }
        ],
        dependencies: [
            {
                referenceName: "listeners",
                interfaceName: "runtime.ApplicationLifecycleListener",
                all: true
            }
        ]
    });
    const numberParserService = new ServiceRepr({
        name: "NumberParserServiceImpl",
        packageName: RUNTIME_PACKAGE_NAME,
        factory: createFunctionFactory(
            (options) => new NumberParserServiceImpl(options, properties.locale)
        ),
        intl: i18n,
        interfaces: [
            {
                interfaceName: RUNTIME_NUMBER_PARSER_SERVICE,
                qualifier: "builtin"
            }
        ]
    });

    return new PackageRepr({
        name: RUNTIME_PACKAGE_NAME,
        services: [apiService, appContext, lifecycleEventService, numberParserService],
        intl: i18n
    });
}
