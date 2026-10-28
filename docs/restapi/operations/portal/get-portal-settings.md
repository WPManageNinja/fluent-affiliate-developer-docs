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
- **Access:** `UserPolicy` — Any logged-in WordPress user. The controller then checks the user's own affiliate account.

<OAOperation operationId="getPortalSettings" specUrl="/openapi/public/portal/get-portal-settings.json" />
