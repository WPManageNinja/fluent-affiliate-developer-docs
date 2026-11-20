---
title: "Install FluentHub"
description: "Install and activate FluentHub, which provides the MCP adapter. FluentAffiliate does not install plugins itself: an active Fluent Pro plugin answers the `fluent_toolkit/do_auto_install` action (FluentAffiliate Pro does). Needs `install_plugins`. Without an installer, returns `422` with `toolkit_download_url`."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/mcp/install-toolkit`
- **Edition:** Core
- **Controller:** `McpSettingsController@installToolkit`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="installFluenthub" specUrl="/openapi/public/mcp/install-fluenthub.json" />
