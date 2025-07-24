# @open-pioneer/authentication-keycloak

This package provides a [Keycloak](https://www.keycloak.org/) plugin for the [authentication package](https://github.com/open-pioneer/trails-core-packages/blob/main/src/packages/authentication/README.md#implementing-an-authentication-plugin).

The package implements an authentication flow using the [Keycloak JavaScript](#https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter) adapter.
For more information about Keycloak, see the [Keycloak documentation](https://www.keycloak.org/).

## Usage

To use the package in your app, first import the `<ForceAuth />` component from the [authentication package](https://github.com/open-pioneer/trails-core-packages/blob/main/src/packages/authentication/README.md#enforcing-authentication) to make sure that only logged in users can use the application.

`ForceAuth` renders its children (your application) if the user is authenticated.
Otherwise, it redirects the user to the Keycloak authentication provider.

To access the `SessionInfo` for the currently logged in user, use the `useAuthState` hook provided by the authentication package.

The following example shows a basic implementation of the functions described before:

```tsx
// AppUI.tsx
import { ForceAuth, useAuthState } from "@open-pioneer/authentication";
import { Notifier } from "@open-pioneer/notifier";
import { useService } from "open-pioneer:react-hooks";

export function AppUI() {
    const authService = useService<AuthService>("authentication.AuthService");
    const authState = useAuthState(authService);
    const sessionInfo = authState.kind == "authenticated" ? authState.sessionInfo : undefined;
    const userName = sessionInfo?.attributes?.userName as string;

    return (
        <>
            {/* recommended for error reporting: */}
            <Notifier />
            <ForceAuth>
                <Text>Logged in as: {userName}</Text>
                <TheRestOfYourApplication />
            </ForceAuth>
        </>
    );
}
```

### Keycloak configuration properties

To configure the `authentication-keycloak` package, adjust these properties.
For more details on the configuration properties, visit the [API Reference](https://www.keycloak.org/docs/latest/securing_apps/index.html#api-reference).

| Property              | Type                  |                                                                                                           Description |                                              Default |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------: |
| keycloakConfig        | KeycloakConfig        | The configuration settings required to establish a connection between the client application and the Keycloak server. |                                                      |
| refreshOptions        | RefreshOptions        |                            Configure token refresh behavior and manage access token lifecycle in client applications. | `{autoRefresh: true, interval: 10000, timeLeft: 60}` |
| keycloakInitOptions   | KeycloakInitOptions   |                                               Configure Keycloak's behavior during client application initialization. |          `{onLoad: "check-sso", pkceMethod: "S256"}` |
| keycloakLoginOptions  | KeycloakLoginOptions  |                                                                 Configure Keycloak login options (e.g. redirect URI). |                                                      |
| keycloakLogoutOptions | KeycloakLogoutOptions |                                                                Configure Keycloak logout options (e.g. redirect URI). |                                                      |

```ts
interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}
interface RefreshOptions {
    autoRefresh: boolean;
    interval: number;
    timeLeft: number;
}
interface KeycloakInitOptions {
    onLoad: string;
    pkceMethod: string;
    scope: string;
}
```

### Using the configuration in an app

```ts
// app.ts
import { KeycloakProperties } from "@open-pioneer/authentication-keycloak";
import { createCustomElement } from "@open-pioneer/runtime";
import * as appMetadata from "open-pioneer:app";
import { AppUI } from "./AppUI";

const element = createCustomElement({
    component: AppUI,
    appMetadata,
    config: {
        properties: {
            "@open-pioneer/authentication-keycloak": {
                keycloakOptions: {
                    keycloakConfig: {
                        url: "http://keycloak-server/base_path",
                        realm: "myrealm",
                        clientId: "myapp"
                    },
                    // optional
                    refreshOptions: {
                        autoRefresh: true,
                        interval: 10000,
                        timeLeft: 60
                    },
                    // optional
                    keycloakInitOptions: {
                        onLoad: "check-sso",
                        pkceMethod: "S256"
                        // additional configuration, for example:
                        // scope: "openid address phone"
                    },
                    // optional
                    keycloakLoginOptions: {
                        // ...
                    },
                    // optional
                    keycloakLogoutOptions: {
                        redirectUri: "https://example.com" // where to redirect after logout
                    }
                }
            } satisfies KeycloakProperties // for auto completion / validation
        }
    }
    // ...
});
```

### Error reporting

In case of an error during authentication (if the Keycloak client library throws an error during `init`), a notification is presented to the user via the `NotificationService` (technical details can be found in the developer console).
You should therefore embed the `<Notifier />` into your application as well.
Note that the Notifier should not be nested in `<ForceAuth />`, because it would not be rendered in case of an authentication problem.

### Accessing the Keycloak token in your application

After a successful login, the Keycloak token can be accessed from the `SessionInfo` of the `AuthService` as in the following sample:

```ts
//SampleTokenInterceptor.ts
import { AuthService } from "@open-pioneer/authentication";
import { ServiceOptions } from "@open-pioneer/runtime";
// ...

class SampleTokenInterceptor implements Interceptor {
    private authService: AuthService;

    constructor(options: ServiceOptions<References>) {
        this.authService = options.references.authService;
    }

    beforeRequest({ target, options }: BeforeRequestParams): void {
        const authState = this.authService.getAuthState();
        const sessionInfo = authState.kind == "authenticated" ? authState.sessionInfo : undefined;
        const keycloak = sessionInfo?.attributes?.keycloak;
        const token = (keycloak as { token: string }).token;
        // ...
    }
}
```

## License

Apache-2.0 (see `LICENSE` file)
