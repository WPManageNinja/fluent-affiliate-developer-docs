---
title: Update Connected Site
description: "Update a single connected site config."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/settings/connected-sites-config/update`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `DomainController@patchSingleSiteConfig`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateConnectedSite" specUrl="/openapi/public/connected-sites/update-connected-site.json" />
