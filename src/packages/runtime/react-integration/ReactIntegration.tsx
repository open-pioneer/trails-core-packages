// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { SystemConfig } from "@chakra-ui/react";
import { ReadonlyReactive } from "@conterra/reactivity-core";
import { Error } from "@open-pioneer/core";
import { ReactNode, StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { RootNode } from "../dom";
import { ErrorId } from "../errors";
import { InterfaceSpec, renderInterfaceSpec } from "../service-layer/InterfaceSpec";
import { PackageRepr } from "../service-layer/PackageRepr";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { renderAmbiguousServiceChoices } from "../service-layer/ServiceLookup";
import { CustomChakraProvider } from "./ChakraProvider";
import { PackageContext, PackageContextMethods } from "./PackageContext";

export interface ReactIntegrationOptions {
    rootNode: RootNode;
    hostNode: HTMLElement;
    appRoot: HTMLDivElement;
    packages: Map<string, PackageRepr>;
    serviceLayer: ServiceLayer;

    locale: string;
    config: SystemConfig | undefined;
    styles: ReadonlyReactive<string>;
}

export class ReactIntegration {
    private rootNode: RootNode;
    private hostNode: HTMLElement;
    private appRoot: HTMLDivElement;
    private reactRoot: Root;
    private packageContext: PackageContextMethods;
    private locale: string;
    private chakraConfig: SystemConfig | undefined;
    private styles: ReadonlyReactive<string>;

    static createForApp(options: ReactIntegrationOptions): ReactIntegration {
        const { serviceLayer, packages } = options;
        const packageContext = createPackageContext(serviceLayer, packages);
        return new ReactIntegration({ ...options, packageContext });
    }

    static createForErrorScreen(
        options: Omit<ReactIntegrationOptions, "serviceLayer" | "packages">
    ) {
        const throwError = () => {
            throw new Error(ErrorId.INVALID_STATE, "Hook cannot be used within the error screen.");
        };
        const packageContext: PackageContextMethods = {
            getIntl: throwError,
            getProperties: throwError,
            getService: throwError,
            getServices: throwError
        };
        return new ReactIntegration({ ...options, packageContext });
    }

    private constructor(
        options: Omit<ReactIntegrationOptions, "serviceLayer" | "packages"> & {
            packageContext: PackageContextMethods;
        }
    ) {
        this.rootNode = options.rootNode;
        this.hostNode = options.hostNode;
        this.appRoot = options.appRoot;
        this.reactRoot = createRoot(options.appRoot);
        this.chakraConfig = options.config;
        this.packageContext = options.packageContext;
        this.locale = options.locale;
        this.styles = options.styles;
    }

    render(contentNode: ReactNode) {
        this.reactRoot.render(
            <StrictMode>
                <CustomChakraProvider
                    rootNode={this.rootNode}
                    hostNode={this.hostNode}
                    appRoot={this.appRoot}
                    config={this.chakraConfig}
                    locale={this.locale}
                    styles={this.styles}
                >
                    <PackageContext.Provider value={this.packageContext}>
                        {contentNode}
                    </PackageContext.Provider>
                </CustomChakraProvider>
            </StrictMode>
        );
    }

    destroy() {
        this.reactRoot.unmount();
    }
}

export function EmptyComponent(): ReactNode {
    return null;
}

function createPackageContext(
    serviceLayer: ServiceLayer,
    packages: Map<string, PackageRepr>
): PackageContextMethods {
    const getPackage = (packageName: string): PackageRepr => {
        const pkg = packages.get(packageName);
        if (!pkg) {
            throw new Error(
                ErrorId.INTERNAL,
                `Package '${packageName}' was not found in application.`
            );
        }
        return pkg;
    };

    const packageContext: PackageContextMethods = {
        getService: (packageName, interfaceName, options) => {
            const spec: InterfaceSpec = { interfaceName, ...options };
            const result = serviceLayer.getService(packageName, spec);
            if (result.type === "found") {
                return result.value.getInstanceOrThrow();
            }

            const renderedSpec = renderInterfaceSpec(spec);
            switch (result.type) {
                case "unimplemented":
                    throw new Error(
                        ErrorId.INTERFACE_NOT_FOUND,
                        `The UI of package '${packageName}' requested the unimplemented interface ${renderedSpec}.`
                    );
                case "undeclared":
                    throw new Error(
                        ErrorId.UNDECLARED_DEPENDENCY,
                        `Package '${packageName}' did not declare an UI dependency on interface ${renderedSpec}.` +
                            ` Add the dependency to the package configuration or remove the usage.`
                    );
                case "ambiguous": {
                    const renderedChoices = renderAmbiguousServiceChoices(result.choices);
                    throw new Error(
                        ErrorId.AMBIGUOUS_DEPENDENCY,
                        `The UI of package '${packageName}' requires the ambiguous interface ${renderedSpec}.` +
                            ` Possible choices are: ${renderedChoices}.`
                    );
                }
                case "unknown-package":
                    throw new Error(
                        ErrorId.MISSING_PACKAGE,
                        missingPackageMessage(packageName, interfaceName)
                    );
            }
        },
        getServices: (packageName, interfaceName) => {
            const result = serviceLayer.getServices(packageName, interfaceName);
            if (result.type === "found") {
                return result.value.map((serviceRepr) => serviceRepr.getInstanceOrThrow());
            }

            switch (result.type) {
                case "undeclared":
                    throw new Error(
                        ErrorId.UNDECLARED_DEPENDENCY,
                        `Package '${packageName}' did not declare an UI dependency on all services implementing interface '${interfaceName}'.` +
                            ` Add the dependency ("all": true) to the package configuration or remove the usage.`
                    );
                case "unknown-package":
                    throw new Error(
                        ErrorId.MISSING_PACKAGE,
                        missingPackageMessage(packageName, interfaceName)
                    );
            }
        },
        getProperties: (packageName) => {
            return getPackage(packageName).properties;
        },
        getIntl: (packageName) => {
            return getPackage(packageName).intl;
        }
    };
    return packageContext;
}

function missingPackageMessage(packageName: string, interfaceName: string) {
    return (
        `Package '${packageName}' was not found in the application's metadata while it attempted to reference the interface '${interfaceName}'. ` +
        `Check that the dependency is declared correctly in the packages that use '${packageName}'.`
    );
}
