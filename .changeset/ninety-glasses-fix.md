---
"@open-pioneer/chakra-integration": major
---

Rename `container` prop to `rootNode`. This property refers to the application's shadow root and was misnamed.
Introduce `container` prop that refers to the application's container element (the root html element inside the shadow root).
