---
title: Get Portal Settings
description: "Get the authenticated affiliate's portal settings."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/settings`
- **Edition:** Core
- **Controller:** `PortalController@getSettings`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — A logged-in WordPress user with an `active` affiliate account. Pending and inactive affiliates are rejected.

<OAOperation operationId="getPortalSettings" specUrl="/openapi/public/portal/get-portal-settings.json" />
