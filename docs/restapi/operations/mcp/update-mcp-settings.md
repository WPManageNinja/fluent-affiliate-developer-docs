---
title: "Update MCP Settings"
description: "Turn the MCP server on or off (`settings.enabled`: `yes` or `no`). Only a site administrator (`manage_options`) can change it; other users get `403`."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/mcp`
- **Edition:** Core
- **Controller:** `McpSettingsController@save`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="updateMcpSettings" specUrl="/openapi/public/mcp/update-mcp-settings.json" />
