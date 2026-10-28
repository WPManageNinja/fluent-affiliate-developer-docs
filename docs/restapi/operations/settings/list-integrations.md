---
title: List Integrations
description: "List registered integrations."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/integrations`
- **Edition:** Core
- **Controller:** `IntegrationController@index`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listIntegrations" specUrl="/openapi/public/settings/list-integrations.json" />
