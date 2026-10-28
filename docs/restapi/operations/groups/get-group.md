---
title: Get Group
description: "Get a single affiliate group."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/groups/{id}`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@show`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getGroup" specUrl="/openapi/public/groups/get-group.json" />
