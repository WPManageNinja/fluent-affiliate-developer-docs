---
title: Get Affiliate
description: "Retrieve a single affiliate by ID."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates/{id}`
- **Edition:** Core
- **Controller:** `AffiliateController@getAffiliate`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="getAffiliate" specUrl="/openapi/public/affiliates/get-affiliate.json" />
