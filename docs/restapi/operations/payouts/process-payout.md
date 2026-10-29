---
title: Process Payout
description: "Process a payout batch."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/payouts/process-payout`
- **Edition:** Core
- **Controller:** `PayoutController@processPayout`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="processPayout" specUrl="/openapi/public/payouts/process-payout.json" />
