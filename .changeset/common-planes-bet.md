---
"@open-pioneer/chakra-snippets": patch
"@open-pioneer/base-theme": patch
"@open-pioneer/test-utils": patch
"@open-pioneer/runtime": patch
---

Update to Chakra UI 3.35.0

- update to Chakra UI @ 3.35.0, Ark UI @ 5.36.2, Zag JS @ 1.40.0
- create multiple patches for Zag JS to fix positioning of popover, tooltip, ...
- remove redundant Zag JS splitter patch
- use pointer cursor for interactive elements in color picker component
- use TooltipProviderProps to override `openDelay` globally (instead of Tooltip snippet)
