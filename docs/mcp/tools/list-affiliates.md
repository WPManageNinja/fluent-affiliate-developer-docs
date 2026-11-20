---
title: "List Affiliates"
description: "List affiliates with status, commission rate, earnings and counts."
---

# List Affiliates

List affiliates with status, commission rate, earnings and counts. Filter by status (status=pending lists applications to review), search or unpaid earnings.

| | |
|---|---|
| **Ability** | `fluent-affiliate/list-affiliates` |
| **MCP tool name** | `fluent-affiliate-list-affiliates` |
| **Group** | Affiliates |
| **Permission** | Read affiliates: `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `AffiliateTools::listAffiliates` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `status` | `string` | No | pending: applied, waiting for approval. inactive: cannot earn. One of: `pending`, `active`, `inactive`. |
| `search` | `string` | No | Part of the name, login, email, payment email, or the affiliate id. |
| `has_unpaid` | `boolean` | No | true: only affiliates with unpaid earnings. |
| `created_from` | `string` | No | Applied or added on or after this date (created_at). Site time unless it has an offset. |
| `created_to` | `string` | No | A bare date includes the whole day. |
| `sort_by` | `string` | No | Default id. One of: `id`, `created_at`, `unpaid_earnings`, `total_earnings`, `referrals`, `visits`. |
| `sort_dir` | `string` | No | Default DESC. One of: `ASC`, `DESC`. |
| `page` | `integer` | No | Page number, from 1. Minimum 1. |
| `per_page` | `integer` | No | Rows per page. Default 20, max 100. Minimum 1. |
| `group_id` <span class="pro-badge">PRO</span> | `integer` | No | Affiliate group id, from get-affiliate-context with include=groups. |

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
    "name": "fluent-affiliate-list-affiliates",
    "arguments": {}
  }
}
```
