---
title: Bulk Update Payout Transactions
description: "Bulk update payout transactions."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/payouts/{id}/transactions/bulk-action`
- **Edition:** Core
- **Controller:** `PayoutController@bulkPatchTransactions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="bulkUpdatePayoutTransactions" specUrl="/openapi/public/payouts/bulk-update-payout-transactions.json" />
