---
title: Update Group
description: "Update an affiliate group."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/settings/groups/{id}`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@update`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateGroup" specUrl="/openapi/public/groups/update-group.json" />
