// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { Error } from "@open-pioneer/core";
import { PackageContextMethods } from "@open-pioneer/runtime-react-support";
import { ServiceLayer } from "../service-layer/ServiceLayer";
import { PackageRepr } from "../service-layer/PackageRepr";
import { InterfaceSpec, renderInterfaceSpec } from "../service-layer/InterfaceSpec";
import { ErrorId } from "../errors";
import { renderAmbiguousServiceChoices } from "../service-layer/ServiceLookup";

/**
 * The result of this function call is inherited through the react tree
 * to support hooks like `useService`.
 */
export function createPackageContext(
    packages: Map<string, PackageRepr>,
    serviceLayer: ServiceLayer
): PackageContextMethods {
    function getPackage(packageName: string): PackageRepr {
        const pkg = packages.get(packageName);
        if (!pkg) {
            throw new Error(
                ErrorId.INTERNAL,
                `Package '${packageName}' was not found in this application.`
            );
        }
        return pkg;
    }

    return {
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
            }
        },
        getProperties: (packageName) => {
            return getPackage(packageName).properties;
        },
        getIntl: (packageName) => {
            return getPackage(packageName).intl;
        }
    };
}
