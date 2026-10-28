---
title: Update Connected Sites Status
description: "Update the global connected-sites status."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/settings/connected-sites-config`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `DomainController@updateGlobalStatus`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateConnectedSitesStatus" specUrl="/openapi/public/connected-sites/update-connected-sites-status.json" />
