---
title: Update Payout Transaction
description: "Update a payout transaction."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/payouts/{id}/transactions/{transaction_id}`
- **Edition:** Core
- **Controller:** `PayoutController@patchTransaction`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="updatePayoutTransaction" specUrl="/openapi/public/payouts/update-payout-transaction.json" />
