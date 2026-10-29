---
title: Update Affiliate Status
description: "Change an affiliate's status."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/affiliates/{id}/status`
- **Edition:** Core
- **Controller:** `AffiliateController@updateAffiliateStatus`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="updateAffiliateStatus" specUrl="/openapi/public/affiliates/update-affiliate-status.json" />
