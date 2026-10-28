---
title: Update Feature Settings
description: "Update settings for a specific feature."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/features/{feature_key}`
- **Edition:** Core
- **Controller:** `SettingController@updateFeatureSettings`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateFeatureSettings" specUrl="/openapi/public/settings/update-feature-settings.json" />
