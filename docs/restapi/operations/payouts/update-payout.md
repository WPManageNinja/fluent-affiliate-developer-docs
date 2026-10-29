---
title: Update Payout
description: "Update a payout."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/payouts/{id}`
- **Edition:** Core
- **Controller:** `PayoutController@updatePayout`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="updatePayout" specUrl="/openapi/public/payouts/update-payout.json" />
