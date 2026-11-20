---
title: "Get MCP Settings"
description: "Get the MCP server status for the settings screen: the switch, the endpoint URL, the connection name for AI apps, the MCP adapter status, the FluentHub state, the tool count, and whether the current user can connect."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/mcp`
- **Edition:** Core
- **Controller:** `McpSettingsController@get`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getMcpSettings" specUrl="/openapi/public/mcp/get-mcp-settings.json" />
