---
title: Get Migration Status
description: "Poll the status of a running migration."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/migrations/status`
- **Edition:** Core
- **Controller:** `MigrationController@getPollingStatus`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getMigrationStatus" specUrl="/openapi/public/settings/get-migration-status.json" />
