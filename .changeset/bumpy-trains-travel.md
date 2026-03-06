---
"@open-pioneer/test-utils": patch
---

Apply chakra theme correctly when rendering react components in (browser-) tests within the `PackageContextProvider`.
Previously, chakra components were actually unstyled.
