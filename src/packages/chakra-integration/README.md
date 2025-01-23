# @open-pioneer/chakra-integration

TODO: Package is obsolete

This package integrates [Chakra UI](https://chakra-ui.com/) into an Open Pioneer Trails application.
All components are re-exported from `@chakra-ui/react` (sometimes with some modifications).
All UI packages using the Open Pioneer Trails framework should use this package instead of depending on `@chakra-ui/react` directly.

## Internals

Some changes are made to complex components such as `Modal`, `Drawer` etc. to support integration into a web component's shadow DOM.
For more details, see comments in `./Provider.tsx`.

## License

Apache-2.0 (see `LICENSE` file)
