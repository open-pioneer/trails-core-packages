---
"@open-pioneer/react-utils": patch
---

Remove the prop `substituteHeadingLevel` from the `TitledSectionProps` interface.
The property was mistakenly documented, but was never implemented.
You can use the `<ConfigureTitledSection />` component instead.
