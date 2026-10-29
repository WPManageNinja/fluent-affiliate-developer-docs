---
title: List Portal Referrals
description: "Get the authenticated affiliate's referrals."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/referrals`
- **Edition:** Core
- **Controller:** `PortalController@getReferrals`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — A logged-in WordPress user with an `active` affiliate account. Pending and inactive affiliates are rejected.

<OAOperation operationId="listPortalReferrals" specUrl="/openapi/public/portal/list-portal-referrals.json" />
