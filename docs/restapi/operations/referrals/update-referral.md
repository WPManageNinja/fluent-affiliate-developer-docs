---
title: Update Referral
description: "Update a referral."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/referrals/{id}`
- **Edition:** Core
- **Controller:** `ReferralController@update`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `ReferralPolicy` — `manage_options`, or `manage_all_referrals` or `manage_all_data`.

<OAOperation operationId="updateReferral" specUrl="/openapi/public/referrals/update-referral.json" />
