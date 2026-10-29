---
title: Delete Referral
description: "Delete a referral."
outline: false
aside: false
---
## Endpoint

- **Method:** `DELETE`
- **Path:** `/referrals/{id}`
- **Edition:** Core
- **Controller:** `ReferralController@destroy`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `ReferralPolicy` — `manage_options`, or `manage_all_referrals` or `manage_all_data`.

<OAOperation operationId="deleteReferral" specUrl="/openapi/public/referrals/delete-referral.json" />
