// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { ComponentType, StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { Error } from "@open-pioneer/core";
import { ErrorId } from "../errors";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { PackageContext, PackageContextMethods } from "@open-pioneer/runtime-react-support";
import { PackageRepr } from "../service-layer/PackageRepr";
import { InterfaceSpec, renderInterfaceSpec } from "../service-layer/InterfaceSpec";
import { renderAmbiguousServiceChoices } from "../service-layer/ServiceLookup";
import { CustomChakraProvider } from "@open-pioneer/chakra-integration";
import { theme as defaultTrailsTheme } from "@open-pioneer/base-theme";

export interface ReactIntegrationOptions {
    packages: Map<string, PackageRepr>;
    serviceLayer: ServiceLayer;
    rootNode: HTMLDivElement;
    container: Node;
    theme: Record<string, unknown> | undefined;
}

export class ReactIntegration {
    private containerNode: Node;
    private theme: Record<string, unknown> | undefined;
    private root: Root;
    private packageContext: PackageContextMethods;

    static createForApp(options: ReactIntegrationOptions): ReactIntegration {
        const { serviceLayer, packages } = options;
        const packageContext = createPackageContext(serviceLayer, packages);
        return new ReactIntegration({ ...options, packageContext });
    }

    static createForErrorScreen(
        options: Omit<ReactIntegrationOptions, "serviceLayer" | "packages">
    ) {
        const throwError = () => {
            // TODO: Pick an error id
            throw new Error(ErrorId.INTERNAL, "Hook cannot be used within the error screen.");
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
        this.containerNode = options.container;
        this.theme = options.theme;
        this.root = createRoot(options.rootNode);
        this.packageContext = options.packageContext;
    }

    render(Component: ComponentType) {
        this.root.render(
            <StrictMode>
                <CustomChakraProvider
                    container={this.containerNode}
                    colorMode="light"
                    theme={this.theme ?? defaultTrailsTheme}
                >
                    <PackageContext.Provider value={this.packageContext}>
                        <Component />
                    </PackageContext.Provider>
                </CustomChakraProvider>
            </StrictMode>
        );
    }

    destroy() {
        this.root.unmount();
    }
}

function createPackageContext(
    serviceLayer: ServiceLayer,
    packages: Map<string, PackageRepr>
): PackageContextMethods {
    const getPackage = (packageName: string): PackageRepr => {
        const pkg = packages.get(packageName); // todo own error message if this.packages is undefined?
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
