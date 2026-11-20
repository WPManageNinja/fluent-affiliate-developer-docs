---
title: "Get Payout"
description: "Read one payout with its transactions: one per affiliate, with amount, status and the affiliate's payment email."
---

# Get Payout

Read one payout with its transactions: one per affiliate, with amount, status and the affiliate's payment email.

| | |
|---|---|
| **Ability** | `fluent-affiliate/get-payout` |
| **MCP tool name** | `fluent-affiliate-get-payout` |
| **Group** | Payouts |
| **Permission** | Read payouts: `manage_options`, or `read_all_payouts`, `manage_all_payouts` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `PayoutTools::getPayout` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `integer` | Yes | Payout id. |
| `transaction_status` | `string` | No | One of: `processing`, `paid`, `failed`. |
| `page` | `integer` | No | Page number, from 1. Minimum 1. |
| `per_page` | `integer` | No | Rows per page. Default 20, max 100. Minimum 1. |

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
    "name": "fluent-affiliate-get-payout",
    "arguments": {
      "id": 1
    }
  }
}
```
