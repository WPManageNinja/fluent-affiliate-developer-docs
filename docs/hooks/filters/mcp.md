---
title: "MCP Server"
description: "Filter hooks in the MCP Server category."
---

# MCP Server

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/mcp_tool_definitions`](#fluent-affiliate-mcp-tool-definitions) | Adds tools to the FluentAffiliate MCP server. |
| [`fluent_affiliate/mcp_ability_names`](#fluent-affiliate-mcp-ability-names) | Filters the tool names the FluentAffiliate MCP server exposes. |
| [`fluent_affiliate/mcp/single_result_copy`](#fluent-affiliate-mcp-single-result-copy) | Controls whether the FluentAffiliate MCP endpoint sends each successful tool result once, as text. |
| [`fluent_affiliate/mcp/server_instructions`](#fluent-affiliate-mcp-server-instructions) | Filters the instructions the FluentAffiliate MCP server sends to AI clients in the MCP `instructions` field. |

## `fluent_affiliate/mcp_tool_definitions`

Adds tools to the FluentAffiliate MCP server. Each definition is keyed by its ability name, which must start with `fluent-affiliate/`, and takes the same keys as the built-in tools: `label`, `description`, `input_schema`, `execute_callback`, `annotations` and `requires`. A definition with a missing key, an invalid `requires`, or the name of a built-in tool is ignored. See the [MCP guide](/guides/mcp#add-your-own-tool).

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$definitions` | `array` | Extra tool definitions keyed by ability name. Default `[]`. |

**Source:** `app/Modules/MCP/AbilitiesRegistrar.php`

```php
add_filter('fluent_affiliate/mcp_tool_definitions', function($definitions) {
    $definitions['fluent-affiliate/count-pending'] = [
        'label'            => 'Count Pending Affiliates',
        'description'      => 'Count the affiliates waiting for approval.',
        'input_schema'     => ['type' => 'object', 'properties' => []],
        'execute_callback' => 'my_count_pending_affiliates',
        'annotations'      => ['readonly' => true, 'destructive' => false, 'idempotent' => true, 'openWorldHint' => false],
        'requires'         => 'affiliate_read', // one of McpGate::REQUIREMENTS
    ];
    return $definitions;
});
```

## `fluent_affiliate/mcp_ability_names`

Filters the tool names the FluentAffiliate MCP server exposes. Remove a name to hide that tool from every client. A name that is not a registered FluentAffiliate tool is dropped, so this filter cannot add tools; use `fluent_affiliate/mcp_tool_definitions` for that. The list is also filtered per user: a client sees only the tools its user has the permission for.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$names` | `string[]` | Ability names, such as `fluent-affiliate/list-referrals`. |

**Source:** `app/Modules/MCP/AbilitiesRegistrar.php`

```php
// Read-only MCP: hide every tool that writes
add_filter('fluent_affiliate/mcp_ability_names', function($names) {
    $writes = ['create-affiliate', 'update-affiliate', 'save-referral', 'update-referrals',
               'create-payout', 'update-transaction', 'remove-transaction'];

    return array_values(array_filter($names, function($name) use ($writes) {
        return !in_array(substr($name, strlen('fluent-affiliate/')), $writes, true);
    }));
});
```

## `fluent_affiliate/mcp/single_result_copy`

Controls whether the FluentAffiliate MCP endpoint sends each successful tool result once, as text. The MCP adapter sends every result twice (as text and as `structuredContent`), and some clients pass both copies to the model. Return `false` for a client program that reads `structuredContent` and not the text. Applies only to the `/wp-json/fluent-affiliate/mcp` route, not to FluentHub.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$once` | `bool` | Default `true`. |

**Source:** `app/Modules/MCP/MCPInit.php`

```php
add_filter('fluent_affiliate/mcp/single_result_copy', '__return_false');
```

## `fluent_affiliate/mcp/server_instructions`

Filters the instructions the FluentAffiliate MCP server sends to AI clients in the MCP `instructions` field. FluentHub also sends them on every help call, so keep them short and in plain English. The default text is shown on the [MCP Server](/mcp/#server-instructions) page.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$instructions` | `string` | The server instructions. |

**Source:** `app/Modules/MCP/MCPInit.php`

```php
add_filter('fluent_affiliate/mcp/server_instructions', function($instructions) {
    return $instructions . "

House rule: never approve an affiliate without asking the person first.";
});
```

