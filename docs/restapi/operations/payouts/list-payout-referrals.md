---
title: List Payout Referrals
description: "List referrals included in a payout."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/payouts/{id}/referrals`
- **Edition:** Core
- **Controller:** `PayoutController@getReferrals`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `PayoutPolicy` — checked by `PayoutPolicy::getReferrals()`.

<OAOperation operationId="listPayoutReferrals" specUrl="/openapi/public/payouts/list-payout-referrals.json" />
