---
title: List Groups
description: "List all affiliate groups."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/groups`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@index`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listGroups" specUrl="/openapi/public/groups/list-groups.json" />
