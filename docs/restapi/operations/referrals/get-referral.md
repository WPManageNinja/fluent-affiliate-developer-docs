---
title: Get Referral
description: "Retrieve a single referral."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/referrals/{id}`
- **Edition:** Core
- **Controller:** `ReferralController@show`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `ReferralPolicy` — `manage_options`, or `read_all_referrals`, `manage_all_referrals` or `manage_all_data`.

<OAOperation operationId="getReferral" specUrl="/openapi/public/referrals/get-referral.json" />
