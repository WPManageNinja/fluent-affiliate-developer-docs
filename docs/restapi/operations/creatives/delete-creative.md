---
title: Delete Creative
description: "Delete a creative."
outline: false
aside: false
---
## Endpoint

- **Method:** `DELETE`
- **Path:** `/settings/creatives/{id}`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `CreativeController@destroy`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="deleteCreative" specUrl="/openapi/public/creatives/delete-creative.json" />
