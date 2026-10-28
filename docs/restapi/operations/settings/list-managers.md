---
title: List Managers
description: "List affiliate managers."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/managers`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `ProSettingController@getManagers`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listManagers" specUrl="/openapi/public/settings/list-managers.json" />
