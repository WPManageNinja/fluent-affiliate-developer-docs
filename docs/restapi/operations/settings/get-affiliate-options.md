---
title: Get Affiliate Options
description: "Get affiliate options for select inputs."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/options/affiliates`
- **Edition:** Core
- **Controller:** `SettingController@getAffiliatesOptions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — checked by `AdminPolicy::getAffiliatesOptions()`.

<OAOperation operationId="getAffiliateOptions" specUrl="/openapi/public/settings/get-affiliate-options.json" />
