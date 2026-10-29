---
title: List Portal Visits
description: "Get the authenticated affiliate's visits."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/visits`
- **Edition:** Core
- **Controller:** `PortalController@getVisits`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — A logged-in WordPress user with an `active` affiliate account. Pending and inactive affiliates are rejected.

<OAOperation operationId="listPortalVisits" specUrl="/openapi/public/portal/list-portal-visits.json" />
