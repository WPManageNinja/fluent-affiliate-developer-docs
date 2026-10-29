---
title: List Payout Transactions
description: "List transactions in a payout."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/payouts/{id}/transactions`
- **Edition:** Core
- **Controller:** `PayoutController@getTransactions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `read_all_payouts`, `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="listPayoutTransactions" specUrl="/openapi/public/payouts/list-payout-transactions.json" />
