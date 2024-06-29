---
"@open-pioneer/chakra-integration": major
---

Rename the `container` prop of the `CustomChakraProvider` to `rootNode`.
This property refers to the application's shadow root and was misnamed.
Introduce `container` prop that refers to the application's container element (the root html element inside the shadow root).
