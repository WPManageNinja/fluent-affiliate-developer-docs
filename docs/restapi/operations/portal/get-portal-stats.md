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
- **Access:** `UserPolicy` — A logged-in WordPress user with an `active` affiliate account. Pending and inactive affiliates are rejected.

<OAOperation operationId="getPortalStats" specUrl="/openapi/public/portal/get-portal-stats.json" />
