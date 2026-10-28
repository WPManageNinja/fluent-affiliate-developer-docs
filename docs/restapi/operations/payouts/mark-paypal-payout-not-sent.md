---
title: Mark PayPal Payout Not Sent
description: "Mark an unconfirmed PayPal payout as not sent, after the admin checked that the payout is not in the PayPal account. Its open transactions become `failed`, so they can be paid by hand or removed."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/payouts/{id}/paypal-not-sent`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalPayoutController@markNotSent`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="markPaypalPayoutNotSent" specUrl="/openapi/public/payouts/mark-paypal-payout-not-sent.json" />
