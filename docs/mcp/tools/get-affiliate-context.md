---
title: "Get Affiliate Context"
description: "START HERE: who you are, your permissions, the currency, the site timezone, and what needs attention (pending affiliates, unpaid referrals, payouts to settle)."
---

# Get Affiliate Context

START HERE: who you are, your permissions, the currency, the site timezone, and what needs attention (pending affiliates, unpaid referrals, payouts to settle). Call it once first.

| | |
|---|---|
| **Ability** | `fluent-affiliate/get-affiliate-context` |
| **MCP tool name** | `fluent-affiliate-get-affiliate-context` |
| **Group** | Context |
| **Permission** | Any FluentAffiliate permission: `manage_options`, or `PermissionManager::hasAnyPermission()` |
| **Type** | Read-only |
| **Runs** | `ContextTools::getContext` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `include` <span class="pro-badge">PRO</span> | `string[]` | No | groups: the affiliate groups with their ids and rates. One of: `groups`. |

## Annotations

| Hint | Value |
|---|---|
| `readonly` | `true` |
| `destructive` | `false` |
| `idempotent` | `true` |
| `openWorldHint` | `false` |

## Example request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "fluent-affiliate-get-affiliate-context",
    "arguments": {}
  }
}
```
