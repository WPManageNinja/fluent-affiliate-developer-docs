---
title: Get Group Statistics
description: "Get detailed statistics for a group."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/groups/{id}/statistics`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@statistics`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getGroupStatistics" specUrl="/openapi/public/groups/get-group-statistics.json" />
