---
title: List Features
description: "List all feature modules."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/features`
- **Edition:** Core
- **Controller:** `SettingController@getFeatures`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listFeatures" specUrl="/openapi/public/settings/list-features.json" />
