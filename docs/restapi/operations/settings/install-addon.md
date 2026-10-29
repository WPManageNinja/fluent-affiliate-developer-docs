---
title: Install Addon
description: "Install an addon."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/addons/install`
- **Edition:** Core
- **Controller:** `SettingController@installAddon`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="installAddon" specUrl="/openapi/public/settings/install-addon.json" />
