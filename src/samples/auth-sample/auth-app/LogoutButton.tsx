// SPDX-FileCopyrightText: 2023 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import { AuthService, useAuthState } from "@open-pioneer/authentication";
import { Button } from "@chakra-ui/react";
import { useService } from "open-pioneer:react-hooks";

export function LogoutButton() {
    const authService = useService<AuthService>("authentication.AuthService");
    const authState = useAuthState(authService);
    const doLogout = () => {
        authService.logout();
    };

    if (authState.kind === "not-authenticated" || authState.kind === "pending") {
        return null;
    }
    return (
        <Button colorPalette="red" onClick={doLogout}>
            Log out
        </Button>
    );
}
