---
title: Start Migration
description: "Start or resume a data migration. The importers keep the source IDs, so a fresh start (or `reset_migration=yes`) returns `422` when FluentAffiliate already has data: wipe the data first with `POST /settings/migrations/wipe`. Resuming an unfinished run of the same importer is allowed."
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
