// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
import { createContext } from "react";
import type { PackageIntl } from "@open-pioneer/runtime/i18n";
import type { Service } from "@open-pioneer/runtime/Service";
import type { UseServiceOptions } from "@open-pioneer/runtime/react-integration/hooks";

export interface PackageContextMethods {
    getService: (packageName: string, interfaceName: string, options: UseServiceOptions) => Service;
    getServices: (packageName: string, interfaceName: string) => Service[];
    getProperties: (packageName: string) => Readonly<Record<string, unknown>>;
    getIntl(packageName: string): PackageIntl;
}

export const PackageContext = createContext<PackageContextMethods | null>(null);
