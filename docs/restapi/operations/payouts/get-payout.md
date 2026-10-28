---
title: Get Payout
description: "Retrieve a single payout."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/payouts/{id}`
- **Edition:** Core
- **Controller:** `PayoutController@show`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `read_all_payouts`, `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="getPayout" specUrl="/openapi/public/payouts/get-payout.json" />
