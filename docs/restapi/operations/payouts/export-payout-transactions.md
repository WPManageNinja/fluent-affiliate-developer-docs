---
title: Export Payout Transactions
description: "Export payout transactions as CSV rows. Pass `format=paypal` to get `rows` for a PayPal Payouts upload file instead (`email`, `amount`, `currency`), with the amount formatted for the payout currency (whole units for HUF, JPY and TWD; decimal comma for EUR and BRL). A payout sent through a payment gateway cannot be exported in the PayPal format."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/payouts/{id}/transactions-export`
- **Edition:** Core
- **Controller:** `PayoutController@getExportableTransactions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `read_all_payouts`, `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="exportPayoutTransactions" specUrl="/openapi/public/payouts/export-payout-transactions.json" />
