---
title: Get Affiliate Stats
description: "Get summary stats for an affiliate."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates/{id}/stats`
- **Edition:** Core
- **Controller:** `AffiliateController@getOverviewStats`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="getAffiliateStats" specUrl="/openapi/public/affiliates/get-affiliate-stats.json" />
