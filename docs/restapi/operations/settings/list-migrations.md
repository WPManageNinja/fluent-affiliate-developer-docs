---
title: List Migrations
description: "List available data migrators."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/migrations`
- **Edition:** Core
- **Controller:** `MigrationController@getAvailableMigrations`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="listMigrations" specUrl="/openapi/public/settings/list-migrations.json" />
