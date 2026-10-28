---
title: Delete Affiliate
description: "Permanently delete an affiliate."
outline: false
aside: false
---
## Endpoint

- **Method:** `DELETE`
- **Path:** `/affiliates/{id}`
- **Edition:** Core
- **Controller:** `AffiliateController@deleteAffiliate`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="deleteAffiliate" specUrl="/openapi/public/affiliates/delete-affiliate.json" />
