---
title: Send PayPal Payout
description: "Queue a PayPal payout for sending. Only the transactions in `processing` status are sent, in one PayPal batch (15,000 items at most, one currency). The payout moves to `sending`, so a double request sends it once. Rejected when the payout was already sent, or when PayPal may already have it (use `paypal-batch` then)."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/payouts/{id}/paypal-send`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalPayoutController@sendPayout`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="sendPaypalPayout" specUrl="/openapi/public/payouts/send-paypal-payout.json" />
