// SPDX-FileCopyrightText: con terra GmbH and contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable unused-imports/no-unused-vars */
import { DeclaredService, InterfaceNameForServiceType } from "./DeclaredService";

// Tests are on type level only
it("dummy test to allow a file without any real tests", () => undefined);

/**
 * Returns type `true` if types A and B are equal (type false otherwise).
 * See here: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
// prettier-ignore
type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

/**
 * Returns type `true` if T is any kind of string, `false` otherwise.
 */
type IsString<T> = T extends string ? true : false;

// Expect all strings are allowed when service type is unknown
{
    type IFace = InterfaceNameForServiceType<unknown>;
    const isString: Equal<IFace, string> = true;
}

// Expect only the declared interface name is allowed when an explicit service is provided
{
    interface MyService extends DeclaredService<"my.service"> {
        foo(): void;
    }

    type IFace = InterfaceNameForServiceType<MyService>;
    const isConstant: Equal<IFace, "my.service"> = true;
}

// Expect an error is returned when an explicit type is used that does not extend DeclaredService
{
    interface MyService {
        foo(): void;
    }

    type IFace = InterfaceNameForServiceType<MyService>;
    const isString: IsString<IFace> = false;
}
