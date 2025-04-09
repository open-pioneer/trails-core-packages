// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import type { PackageIntl, Service } from "@open-pioneer/runtime";
import {
    PackageContext as InternalPackageContext,
    PackageContextMethods
} from "@open-pioneer/runtime-react-support";
import { CustomChakraProvider } from "@open-pioneer/runtime/test-support";
import { FC, ReactNode, useMemo } from "react";
import { createIntl } from "./vanilla";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyService = Service<any>;

export interface PackageContextProviderProps {
    /** Interface implementations, keyed by interface name. */
    services?: {
        [interfaceName: string]: AnyService;
    };

    /** Interface implementations, keyed by interface name and then by qualifier. */
    qualifiedServices?: {
        [interfaceName: string]: {
            [qualifier: string]: AnyService;
        };
    };

    /** Package properties (keyed by package name). */
    properties?: {
        [packageName: string]: Record<string, unknown>;
    };

    /**
     * The locale for i18n messages and formatting.
     *
     * @default "en"
     */
    locale?: string;

    /**
     * I18n messages for packages
     */
    messages?: {
        /**
         * I18n messages as (messageId, message) entries.
         *
         * @default {}
         */
        [packageName: string]: Record<string, string>;
    };

    /** Children to render */
    children?: ReactNode;
}

/**
 * Injects services and properties into the component tree.
 * React components using Open Pioneer Trails hooks like `useService` and `useProperties`
 * will receive the mocked properties here instead.
 * Currently also wrapped with the CustomChakraProvider to support chakra-ui elements
 */
export const PackageContextProvider: FC<PackageContextProviderProps> = (props) => {
    const { children, ...rest } = props;
    const [locale, contextMethods] = useMemo(() => createPackageContextMethods(rest), [rest]);

    return (
        <CustomChakraProvider rootNode={document} appRoot={document.body} locale={locale}>
            <InternalPackageContext.Provider value={contextMethods}>
                {children}
            </InternalPackageContext.Provider>
        </CustomChakraProvider>
    );
};

function createPackageContextMethods(
    options: Omit<PackageContextProviderProps, "children">
): [locale: string, PackageContextMethods] {
    const services = options?.services ?? {};
    const qualifiedServices = options?.qualifiedServices ?? {};
    const properties = options?.properties ?? {};
    const locale = options?.locale ?? "en";
    const messages = options?.messages ?? {};
    const cachedIntl: Record<string, PackageIntl> = {};
    const methods: PackageContextMethods = {
        getService(packageName, interfaceName, options) {
            if (!options.qualifier) {
                const service = services[interfaceName];
                if (service) {
                    return service;
                }
                const qualified = qualifiedServices[interfaceName];
                if (qualified) {
                    for (const value of Object.values(qualified)) {
                        return value; // Return any implementation
                    }
                }
                throw new Error(
                    `Interface name not bound for testing: '${interfaceName}'. Update the configuration of PackageContextProvider.`
                );
            }

            const qualifiedService = qualifiedServices[interfaceName]?.[options.qualifier];
            if (!qualifiedService) {
                throw new Error(
                    `Interface name not bound for testing: '${interfaceName}' (qualifier '${options.qualifier}'). Update the configuration of PackageContextProvider.`
                );
            }
            return qualifiedService;
        },
        getServices(packageName, interfaceName) {
            const unqualified = services[interfaceName];
            const results = Object.values(qualifiedServices[interfaceName] ?? {});
            if (unqualified) {
                results.push(unqualified);
            }
            return results;
        },
        getProperties(packageName) {
            const packageProperties = properties[packageName];
            if (!packageProperties) {
                throw new Error(
                    `No properties for package '${packageName}' bound for testing. Update the configuration of PackageContextProvider.`
                );
            }
            return packageProperties;
        },
        getIntl(packageName) {
            const initIntl = () => {
                const packageMessages = messages[packageName];
                return createIntl({
                    locale,
                    messages: packageMessages
                });
            };
            return (cachedIntl[packageName] ??= initIntl());
        }
    };
    return [locale, methods];
}
