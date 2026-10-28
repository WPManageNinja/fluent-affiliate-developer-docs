---
title: Get Affiliate Statistics
description: "Get detailed statistics for an affiliate."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates/{id}/statistics`
- **Edition:** Core
- **Controller:** `AffiliateController@statistics`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="getAffiliateStatistics" specUrl="/openapi/public/affiliates/get-affiliate-statistics.json" />
