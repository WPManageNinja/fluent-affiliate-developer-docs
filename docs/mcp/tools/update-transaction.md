---
title: "Update Transaction"
description: "Record that you paid an affiliate: mark one payout transaction, or all processing ones of a payout (all_processing=true), as paid, or one back to processing."
---

# Update Transaction

Record that you paid an affiliate: mark one payout transaction, or all processing ones of a payout (all_processing=true), as paid, or one back to processing. Two calls. A payment that bounced: if it is paid, set it to processing, then call remove-transaction; its referrals become unpaid again. A manual payout keeps no failed record; failed is set only by a payout gateway.

| | |
|---|---|
| **Ability** | `fluent-affiliate/update-transaction` |
| **MCP tool name** | `fluent-affiliate-update-transaction` |
| **Group** | Payouts |
| **Permission** | Manage payouts: `manage_options`, or `manage_all_payouts` or `manage_all_data` |
| **Type** | Write — two calls: preview, then confirm |
| **Runs** | `PayoutTools::setTransactionStatus` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `payout_id` | `integer` | Yes |  |
| `transaction_id` | `integer` | No | One transaction of the payout. Required unless all_processing is true. |
| `all_processing` | `boolean` | No | true with status=paid and no transaction_id: mark every processing transaction of the payout paid. |
| `status` | `string` | Yes | One of: `paid`, `processing`. |
| `confirm` | `string` | No | Leave it out to get a preview and a confirm value. Send that value back only after the person agreed to the preview. |

## Two-step confirmation

A call without `confirm` changes nothing. It returns `needs_confirmation: true`, a `preview` of the change, and a `confirm` value. Show the preview to the person. After they agree, call `update-transaction` again with the same arguments and that `confirm` value. The value stays valid for at least 15 minutes, only while what the preview showed is unchanged, and only once. A stale value fails with `invalid_param` on `confirm`, and the error carries the new preview and confirm value. See [Conventions](/mcp/#conventions).

## Annotations

| Hint | Value |
|---|---|
| `readonly` | `false` |
| `destructive` | `false` |
| `idempotent` | `true` |
| `openWorldHint` | `true` |

## Example request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "fluent-affiliate-update-transaction",
    "arguments": {
      "payout_id": 1,
      "status": "paid"
    }
  }
}
```
