---
title: Get Email Config
description: "Get email notification configuration."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/email-config`
- **Edition:** Core
- **Controller:** `SettingController@getEmailConfig`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getEmailConfig" specUrl="/openapi/public/settings/get-email-config.json" />
