---
title: List Payouts
description: "List payouts."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/payouts`
- **Edition:** Core
- **Controller:** `PayoutController@index`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — `manage_options`, or `read_all_payouts`, `manage_all_payouts` or `manage_all_data`.

<OAOperation operationId="listPayouts" specUrl="/openapi/public/payouts/list-payouts.json" />
