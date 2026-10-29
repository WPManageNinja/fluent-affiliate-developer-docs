---
title: Get Migration Statistics
description: "Get migration statistics."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/migrations/statistics`
- **Edition:** Core
- **Controller:** `MigrationController@getMigrationStatistics`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getMigrationStatistics" specUrl="/openapi/public/settings/get-migration-statistics.json" />
