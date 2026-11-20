---
title: "Save Referral"
description: "Create a manual referral (affiliate_id), or change one (id): amount, status, type and description."
---

# Save Referral

Create a manual referral (affiliate_id), or change one (id): amount, status, type and description. Two calls: the first returns a preview and a confirm value. A paid, processing or payout-held referral cannot change (get-referral shows can_edit); to correct one, take its transaction out with remove-transaction first. Money already sent is not taken back. A bonus is type sale with a description.

| | |
|---|---|
| **Ability** | `fluent-affiliate/save-referral` |
| **MCP tool name** | `fluent-affiliate-save-referral` |
| **Group** | Referrals |
| **Permission** | Manage referrals: `manage_options`, or `manage_all_referrals` or `manage_all_data` |
| **Type** | Write — two calls: preview, then confirm |
| **Runs** | `ReferralTools::saveReferral` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `integer` | No | Referral to change. Leave out to create one. |
| `affiliate_id` | `integer` | No | Affiliate the new referral is for. Only when creating. |
| `amount` | `number` | No | Commission, a decimal in the site currency. Required when creating. Minimum 0. |
| `status` | `string` | No | unpaid: owed, goes into the next payout. pending: waits for approval. rejected: no commission. Required when creating. One of: `pending`, `unpaid`, `rejected`. |
| `type` | `string` | No | Default sale. A referral an integration wrote keeps its own type. One of: `sale`, `opt_in`. |
| `description` | `string` | No | What the commission is for. |
| `confirm` | `string` | No | Leave it out to get a preview and a confirm value. Send that value back only after the person agreed to the preview. |

## Two-step confirmation

A call without `confirm` changes nothing. It returns `needs_confirmation: true`, a `preview` of the change, and a `confirm` value. Show the preview to the person. After they agree, call `save-referral` again with the same arguments and that `confirm` value. The value stays valid for at least 15 minutes, only while what the preview showed is unchanged, and only once. A stale value fails with `invalid_param` on `confirm`, and the error carries the new preview and confirm value. See [Conventions](/mcp/#conventions).

## Annotations

| Hint | Value |
|---|---|
| `readonly` | `false` |
| `destructive` | `false` |
| `idempotent` | `false` |
| `openWorldHint` | `true` |

## Example request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "fluent-affiliate-save-referral",
    "arguments": {}
  }
}
```
