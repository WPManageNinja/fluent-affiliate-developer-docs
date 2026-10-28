---
title: Sync PayPal Payout
description: "Read the payout batch from PayPal and settle each transaction from it. The webhook and the hourly job call the same sync."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/payouts/{id}/paypal-sync`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalPayoutController@syncPayout`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="syncPaypalPayout" specUrl="/openapi/public/payouts/sync-paypal-payout.json" />
