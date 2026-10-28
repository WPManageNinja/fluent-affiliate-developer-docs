---
title: Recover PayPal Batch
description: "Recover a lost PayPal batch: save the PayPal `batch_id` and settle the transactions from it. The batch must carry this payout's sender batch ID."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/payouts/{id}/paypal-batch`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalPayoutController@recoverBatch`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="recoverPaypalBatch" specUrl="/openapi/public/payouts/recover-paypal-batch.json" />
