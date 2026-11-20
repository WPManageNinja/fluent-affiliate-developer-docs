---
title: "Remove Transaction"
description: "Take one unpaid transaction out of a payout: it is deleted and its referrals become unpaid again, for a later payout."
---

# Remove Transaction

Take one unpaid transaction out of a payout: it is deleted and its referrals become unpaid again, for a later payout. Two calls. A paid transaction must go back to processing first (update-transaction).

| | |
|---|---|
| **Ability** | `fluent-affiliate/remove-transaction` |
| **MCP tool name** | `fluent-affiliate-remove-transaction` |
| **Group** | Payouts |
| **Permission** | Manage payouts: `manage_options`, or `manage_all_payouts` or `manage_all_data` |
| **Type** | Write — two calls: preview, then confirm |
| **Runs** | `PayoutTools::removeTransaction` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `payout_id` | `integer` | Yes |  |
| `transaction_id` | `integer` | Yes | A transaction of that payout, from get-payout. |
| `confirm` | `string` | No | Leave it out to get a preview and a confirm value. Send that value back only after the person agreed to the preview. |

## Two-step confirmation

A call without `confirm` changes nothing. It returns `needs_confirmation: true`, a `preview` of the change, and a `confirm` value. Show the preview to the person. After they agree, call `remove-transaction` again with the same arguments and that `confirm` value. The value stays valid for at least 15 minutes, only while what the preview showed is unchanged, and only once. A stale value fails with `invalid_param` on `confirm`, and the error carries the new preview and confirm value. See [Conventions](/mcp/#conventions).

## Annotations

| Hint | Value |
|---|---|
| `readonly` | `false` |
| `destructive` | `true` |
| `idempotent` | `false` |
| `openWorldHint` | `false` |

## Example request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "fluent-affiliate-remove-transaction",
    "arguments": {
      "payout_id": 1,
      "transaction_id": 1
    }
  }
}
```
