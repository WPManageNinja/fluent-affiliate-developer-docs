---
title: List Pages
description: "Get a list of WordPress pages for the portal page selector."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/pages`
- **Edition:** Core
- **Controller:** `SettingController@getPagesOptions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listPages" specUrl="/openapi/public/settings/list-pages.json" />
