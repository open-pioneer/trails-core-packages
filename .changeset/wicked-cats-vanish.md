---
"@open-pioneer/runtime": minor
---

Merge the dom nodes `.pioneer-root` and `.chakra-host`.

Previously, the DOM hierarchy for a trails application looked like this:

```text
<app>
└── shadow root
    └── <div class="pioneer-root">
        └── <div class="chakra-host">
```

It now looks like this:

```text
<app>
└── shadow root
    └── <div class="pioneer-root chakra-host">
```

Since all UI elements where already children of the `.chakra-host` element, this should not affect most applications.

The presence of two node made it possible to accidentally create a node where Chakra's style rules didn't apply.
This change prevents that error.
