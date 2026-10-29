---
title: List Portal Creatives
description: "Get creative assets available to the authenticated affiliate."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/creatives`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `CreativeController@portalCreatives`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `UserPolicy` — A logged-in WordPress user with an `active` affiliate account. Pending and inactive affiliates are rejected.

<OAOperation operationId="listPortalCreatives" specUrl="/openapi/public/creatives/list-portal-creatives.json" />
