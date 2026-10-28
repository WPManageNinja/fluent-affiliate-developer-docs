---
title: Update Email Template
description: "Update a single notification email template."
outline: false
aside: false
---
## Endpoint

- **Method:** `PATCH`
- **Path:** `/settings/email-config/emails`
- **Edition:** Core
- **Controller:** `SettingController@patchSingleNotificationEmail`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateEmailTemplate" specUrl="/openapi/public/settings/update-email-template.json" />
