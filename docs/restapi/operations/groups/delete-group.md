---
title: Delete Group
description: "Delete an affiliate group."
outline: false
aside: false
---
## Endpoint

- **Method:** `DELETE`
- **Path:** `/settings/groups/{id}`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@destroy`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="deleteGroup" specUrl="/openapi/public/groups/delete-group.json" />
