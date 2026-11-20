---
title: "Enable MCP Hub"
description: "Turn on the FluentHub MCP server (`target`: `hub`, the default) or the MCP server of another Fluent plugin (`target`: its slug), through FluentHub. Needs `manage_options`. Nothing can be turned off from this route. Returns `422` with a reason when FluentHub cannot do it."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/mcp/enable-hub`
- **Edition:** Core
- **Controller:** `McpSettingsController@enableHub`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="enableMcpHub" specUrl="/openapi/public/mcp/enable-mcp-hub.json" />
