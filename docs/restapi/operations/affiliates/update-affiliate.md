---
title: Update Affiliate
description: "Update an affiliate's settings."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/affiliates/{id}`
- **Edition:** Core
- **Controller:** `AffiliateController@updateAffiliate`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="updateAffiliate" specUrl="/openapi/public/affiliates/update-affiliate.json" />
