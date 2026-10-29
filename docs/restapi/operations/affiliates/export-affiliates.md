---
title: Export Affiliates
description: "Export affiliates as a CSV file."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates/export`
- **Edition:** Core
- **Controller:** `AffiliateController@export`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data`.

<OAOperation operationId="exportAffiliates" specUrl="/openapi/public/affiliates/export-affiliates.json" />
