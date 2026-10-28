---
title: Get Integration Config
description: "Get configuration for an integration."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/integration/config`
- **Edition:** Core
- **Controller:** `IntegrationController@getConfig`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getIntegrationConfig" specUrl="/openapi/public/settings/get-integration-config.json" />
