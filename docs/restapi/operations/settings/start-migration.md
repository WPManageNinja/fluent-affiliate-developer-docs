---
title: Start Migration
description: "Start a data migration."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/migrations/start`
- **Edition:** Core
- **Controller:** `MigrationController@startMigration`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="startMigration" specUrl="/openapi/public/settings/start-migration.json" />
