---
"@open-pioneer/runtime": patch
---

Fix wrong order of destruction for some services. It was possible for service dependencies to be destroyed before the service.
