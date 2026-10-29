---
title: Save Integration Config
description: "Save integration configuration."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/integration/config`
- **Edition:** Core
- **Controller:** `IntegrationController@saveConfig`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="saveIntegrationConfig" specUrl="/openapi/public/settings/save-integration-config.json" />
