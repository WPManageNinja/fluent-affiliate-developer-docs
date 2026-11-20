---
title: "Update Referrals"
description: "Set the status of up to 100 referrals at once, for example approve pending ones (status=unpaid) or reject them."
---

# Update Referrals

Set the status of up to 100 referrals at once, for example approve pending ones (status=unpaid) or reject them. Two calls: preview, then confirm. Paid, processing or payout-held referrals are refused, and the error lists them.

| | |
|---|---|
| **Ability** | `fluent-affiliate/update-referrals` |
| **MCP tool name** | `fluent-affiliate-update-referrals` |
| **Group** | Referrals |
| **Permission** | Manage referrals: `manage_options`, or `manage_all_referrals` or `manage_all_data` |
| **Type** | Write — two calls: preview, then confirm |
| **Runs** | `ReferralTools::updateReferrals` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ids` | `integer[]` | Yes | Referral ids, from list-referrals. At most 100 items. |
| `status` | `string` | Yes | unpaid: approved and owed, goes into the next payout. rejected: no commission. pending: back to waiting for approval. One of: `unpaid`, `rejected`, `pending`. |
| `confirm` | `string` | No | Leave it out to get a preview and a confirm value. Send that value back only after the person agreed to the preview. |

## Two-step confirmation

A call without `confirm` changes nothing. It returns `needs_confirmation: true`, a `preview` of the change, and a `confirm` value. Show the preview to the person. After they agree, call `update-referrals` again with the same arguments and that `confirm` value. The value stays valid for at least 15 minutes, only while what the preview showed is unchanged, and only once. A stale value fails with `invalid_param` on `confirm`, and the error carries the new preview and confirm value. See [Conventions](/mcp/#conventions).

## Annotations

| Hint | Value |
|---|---|
| `readonly` | `false` |
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
    "name": "fluent-affiliate-update-referrals",
    "arguments": {
      "ids": [
        1,
        2
      ],
      "status": "unpaid"
    }
  }
}
```
