---
title: Validate Payout Config
description: "Validate a payout configuration before processing."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/payouts/validate-payout-config`
- **Edition:** Core
- **Controller:** `PayoutController@validatePayoutConfig`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="validatePayoutConfig" specUrl="/openapi/public/payouts/validate-payout-config.json" />
