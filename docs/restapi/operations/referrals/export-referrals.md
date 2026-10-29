---
title: Export Referrals
description: "Export referrals as CSV."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/referrals/export`
- **Edition:** Core
- **Controller:** `ReferralController@export`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `ReferralPolicy` — `manage_options`, or `read_all_referrals`, `manage_all_referrals` or `manage_all_data`.

<OAOperation operationId="exportReferrals" specUrl="/openapi/public/referrals/export-referrals.json" />
