---
title: Update Email Config
description: "Update email notification configuration."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/email-config`
- **Edition:** Core
- **Controller:** `SettingController@updateEmailConfig`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateEmailConfig" specUrl="/openapi/public/settings/update-email-config.json" />
