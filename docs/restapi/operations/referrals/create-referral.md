---
title: Create Referral
description: "Manually create a referral."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/referrals`
- **Edition:** Core
- **Controller:** `ReferralController@createReferral`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `ReferralPolicy` — `manage_options`, or `manage_all_referrals` or `manage_all_data`.

<OAOperation operationId="createReferral" specUrl="/openapi/public/referrals/create-referral.json" />
