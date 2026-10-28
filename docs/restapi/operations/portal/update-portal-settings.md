---
title: Update Portal Settings
description: "Update the authenticated affiliate's portal settings."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/portal/settings`
- **Edition:** Core
- **Controller:** `PortalController@updateSettings`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — Any logged-in WordPress user. The controller then checks the user's own affiliate account.

<OAOperation operationId="updatePortalSettings" specUrl="/openapi/public/portal/update-portal-settings.json" />
