---
title: Get Portal Stats
description: "Get the authenticated affiliate's summary stats."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/stats`
- **Edition:** Core
- **Controller:** `PortalController@getStats`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — Any logged-in WordPress user. The controller then checks the user's own affiliate account.

<OAOperation operationId="getPortalStats" specUrl="/openapi/public/portal/get-portal-stats.json" />
