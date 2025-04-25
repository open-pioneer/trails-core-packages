// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { createContext } from "react";
import type { PackageIntl } from "../i18n";
import type { Service } from "../Service";
import type { UseServiceOptions } from "./hooks";

export interface PackageContextMethods {
    getService: (packageName: string, interfaceName: string, options: UseServiceOptions) => Service;
    getServices: (packageName: string, interfaceName: string) => Service[];
    getProperties: (packageName: string) => Readonly<Record<string, unknown>>;
    getIntl(packageName: string): PackageIntl;
}

export const PackageContext = createContext<PackageContextMethods | null>(null);
