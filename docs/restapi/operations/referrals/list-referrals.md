---
title: List Referrals
description: "List referrals with filters."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/referrals`
- **Edition:** Core
- **Controller:** `ReferralController@index`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `ReferralPolicy` — `manage_options`, or `read_all_referrals`, `manage_all_referrals` or `manage_all_data`.

<OAOperation operationId="listReferrals" specUrl="/openapi/public/referrals/list-referrals.json" />
