---
title: List Group Affiliates
description: "List affiliates in a group."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/groups/{id}/affiliates`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `AffiliateGroupController@affiliates`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listGroupAffiliates" specUrl="/openapi/public/groups/list-group-affiliates.json" />
