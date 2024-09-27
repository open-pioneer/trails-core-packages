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
    packages?: Map<string, PackageRepr>;
    serviceLayer?: ServiceLayer;
    rootNode: HTMLDivElement;
    container: Node;
    theme: Record<string, unknown> | undefined;
}

export class ReactIntegration {
    private containerNode: Node;
    private theme: Record<string, unknown> | undefined;
    private packages: Map<string, PackageRepr> | undefined;
    private serviceLayer: ServiceLayer | undefined;
    private root: Root;
    private packageContext: PackageContextMethods;

    constructor(options: ReactIntegrationOptions) {
        this.containerNode = options.container;
        this.theme = options.theme;
        this.packages = options.packages;
        this.serviceLayer = options.serviceLayer;
        this.root = createRoot(options.rootNode);

        if (
            (this.packages === undefined && this.serviceLayer !== undefined) ||
            (this.packages !== undefined && this.serviceLayer === undefined)
        ) {
            console.error(
                "ReactIntegration: Either both packages and serviceLayer must be provided or neither."
            );
        }

        this.packageContext = {
            getService: (packageName, interfaceName, options) => {
                const spec: InterfaceSpec = { interfaceName, ...options };
                const result = this.serviceLayer?.getService(packageName, spec);
                if (!result) {
                    throw new Error(ErrorId.INTERNAL, `Service layer is not initialized.`);
                }
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
                const result = this.serviceLayer?.getServices(packageName, interfaceName);
                if (!result) {
                    throw new Error(ErrorId.INTERNAL, `Service layer is not initialized.`);
                }
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
                return this.getPackage(packageName).properties;
            },
            getIntl: (packageName) => {
                return this.getPackage(packageName).intl;
            }
        };
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

    private getPackage(packageName: string): PackageRepr {
        const pkg = this.packages?.get(packageName); // todo own error message if this.packages is undefined?
        if (!pkg) {
            throw new Error(
                ErrorId.INTERNAL,
                `Package '${packageName}' was not found in application.`
            );
        }
        return pkg;
    }
}

function missingPackageMessage(packageName: string, interfaceName: string) {
    return (
        `Package '${packageName}' was not found in the application's metadata while it attempted to reference the interface '${interfaceName}'. ` +
        `Check that the dependency is declared correctly in the packages that use '${packageName}'.`
    );
}
