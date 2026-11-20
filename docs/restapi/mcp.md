---
title: "MCP Settings API"
description: "The \"MCP for AI Agents\" settings screen: read the MCP server status, turn the server on or off, turn on the FluentHub MCP server, and install FluentHub. The MCP tools themselves are documented under [MCP Server](/mcp/)."
---

# MCP Settings API

The "MCP for AI Agents" settings screen: read the MCP server status, turn the server on or off, turn on the FluentHub MCP server, and install FluentHub. The MCP tools themselves are documented under [MCP Server](/mcp/).

## Authentication

MCP settings routes are protected by `AdminPolicy` (`manage_options` or the `manage_all_data` permission). Turning MCP on or off and turning on FluentHub also need `manage_options`; installing FluentHub needs `install_plugins`. The controller checks these capabilities.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/settings/mcp` | Core | [Get MCP Settings](/restapi/operations/mcp/get-mcp-settings) | `McpSettingsController@get` |
| `POST` | `/settings/mcp` | Core | [Update MCP Settings](/restapi/operations/mcp/update-mcp-settings) | `McpSettingsController@save` |
| `POST` | `/settings/mcp/enable-hub` | Core | [Enable MCP Hub](/restapi/operations/mcp/enable-mcp-hub) | `McpSettingsController@enableHub` |
| `POST` | `/settings/mcp/install-toolkit` | Core | [Install FluentHub](/restapi/operations/mcp/install-fluenthub) | `McpSettingsController@installToolkit` |

