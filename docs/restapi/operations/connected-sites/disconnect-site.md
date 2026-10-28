---
title: Disconnect Site
description: "Disconnect a connected site."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/connected-sites-config/disconnect`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `DomainController@disconnectSite`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="disconnectSite" specUrl="/openapi/public/connected-sites/disconnect-site.json" />
