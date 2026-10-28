---
title: Update Integration Status
description: "Enable or disable an integration."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/integration/update-status`
- **Edition:** Core
- **Controller:** `IntegrationController@updateIntegrationStatus`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateIntegrationStatus" specUrl="/openapi/public/settings/update-integration-status.json" />
