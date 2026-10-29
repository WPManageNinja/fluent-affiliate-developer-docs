---
title: Create Group
description: "Create a new affiliate group."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/groups`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@store`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="createGroup" specUrl="/openapi/public/groups/create-group.json" />
