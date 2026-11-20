---
title: "List Payouts"
description: "List payouts (payment runs) with method, status, total, currency and how many transactions are still to settle."
---

# List Payouts

List payouts (payment runs) with method, status, total, currency and how many transactions are still to settle.

| | |
|---|---|
| **Ability** | `fluent-affiliate/list-payouts` |
| **MCP tool name** | `fluent-affiliate-list-payouts` |
| **Group** | Payouts |
| **Permission** | Read payouts: `manage_options`, or `read_all_payouts`, `manage_all_payouts` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `PayoutTools::listPayouts` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `status` | `string` | No | processing: transactions to settle. sending: a gateway is sending it. paid: every transaction is paid. One of: `processing`, `sending`, `paid`. |
| `created_from` | `string` | No | Date or date and time, site time unless it has an offset. |
| `created_to` | `string` | No | A bare date includes the whole day. |
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
    "name": "fluent-affiliate-list-payouts",
    "arguments": {}
  }
}
```
