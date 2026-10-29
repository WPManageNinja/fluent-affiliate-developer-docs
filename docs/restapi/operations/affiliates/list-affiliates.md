---
title: List Affiliates
description: "List all affiliates with pagination and filters."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates`
- **Edition:** Core
- **Controller:** `AffiliateController@index`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="listAffiliates" specUrl="/openapi/public/affiliates/list-affiliates.json" />
