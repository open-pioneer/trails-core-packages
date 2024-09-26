---
"@open-pioneer/authentication": minor
---

Introduce new authentication state `AuthStateAuthenticationError`

Error state is supposed to be used for errors that occur during the authentication process (e.g. lost connection to authentication backend) rather than for failed login attempts (e.g. invalid credentials)

`ForceAuth` component provides two mechanisms to render a fallback component if an authentication error occurs.

`errorFallback` option takes an abitrary react component that is rendered in case of an error. The error object can be accessed via the ErrorFallbackPros.

```jsx
<ForceAuth errorFallback={ErrorFallback}>
   App Content
 </ForceAuth>

 function ErrorFallback(props: ErrorFallbackProps) {
   return (
     <>
       <Box margin={2} color={"red"}>{props.error.message}</Box>
    </>
   );
 }
```

If additional inputs or state must be accessed from within the error fallback component the `renderErrorFallback` option should be used.

```jsx
const userName = "user1";
<ForceAuth  renderErrorFallback={(e: Error) => (
      <>
          <Box>Could not login {userName}</Box>
          <Box color={"red"}>{e.message}</Box>
       </>
  )}>
  App Content
</ForceAuth>
```

The `renderErrorFallback` property takes precedence over the `errorFallback` property.
