---
title: Get License
description: "Get the current Pro license status."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/license`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `LicenseController@getStatus`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `SuperAdminPolicy` — WordPress administrators only (`manage_options`). Not delegable.

<OAOperation operationId="getLicense" specUrl="/openapi/public/license/get-license.json" />
