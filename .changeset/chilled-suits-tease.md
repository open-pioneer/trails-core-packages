---
"@open-pioneer/authentication-keycloak": minor
"@open-pioneer/authentication": minor
---

Replace change events for auth state wiht signals from Reactivty API  
  
watch for updates of the auth state
```typescript
const myAuthService = ...
watch(
    () => [myAuthService.getAuthState()],
    ([state]) => {
        console.log(state);
    },
    {
        immediate: true
    }
);
```

The Auth Service forwards the auth state from the underlying AuthPlugin.
Therefore, the plugin implementation must use reactive signals when its auth state changes in order to singal changes to the service.
```typescript
class DummyPlugin implements AuthPlugin {
    #state  = reactive<AuthState>( {
        kind: "not-authenticated"
    });

    getAuthState(): AuthState {
        return this.#state.value;
    }

    $setAuthState(newState: AuthState) {
        this.#state.value = newState;
    }
}
```
