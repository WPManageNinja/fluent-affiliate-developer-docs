---
title: List Email Templates
description: "List all notification email templates."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/email-config/emails`
- **Edition:** Core
- **Controller:** `SettingController@getNotificationEmails`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listEmailTemplates" specUrl="/openapi/public/settings/list-email-templates.json" />
