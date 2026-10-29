---
title: Update Referral Config
description: "Save the referral program configuration."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/referral-config`
- **Edition:** Core
- **Controller:** `SettingController@saveReferralConfig`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateReferralConfig" specUrl="/openapi/public/settings/update-referral-config.json" />
