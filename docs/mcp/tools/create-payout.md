---
title: "Create Payout"
description: "Pay affiliates their unpaid referrals in one payout run."
---

# Create Payout

Pay affiliates their unpaid referrals in one payout run. Two calls: the first changes nothing and returns who gets how much, what the holding period keeps back, and a confirm value; the second creates the payout. Only unpaid referrals are paid.

| | |
|---|---|
| **Ability** | `fluent-affiliate/create-payout` |
| **MCP tool name** | `fluent-affiliate-create-payout` |
| **Group** | Payouts |
| **Permission** | Manage payouts: `manage_options`, or `manage_all_payouts` or `manage_all_data` |
| **Type** | Write — two calls: preview, then confirm |
| **Runs** | `PayoutTools::createPayout` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | For example "November 2026 commissions". |
| `description` | `string` | Yes |  |
| `start_date` | `string` | No | YYYY-MM-DD, site time. Referrals created on or after this day. Default: no lower limit. |
| `end_date` | `string` | No | YYYY-MM-DD, site time, included. Default: now. |
| `affiliate_ids` | `integer[]` | No | Pay only these affiliates, including inactive and pending ones. Use only affiliates the person named. Default: every active affiliate. |
| `min_payout` | `number` | No | Leave out affiliates owed this amount or less. Minimum 0. |
| `ignore_holding_period` | `boolean` | No | true: also pay referrals still in the holding period (refund window). |
| `payout_method` | `string` | No | Default manual: you pay outside the site. One of: `manual`. The values are the keys of the `fluent_affiliate/payout_methods` filter: `manual`, plus `paypal_payouts` when PayPal Payouts (Pro) is set up. |
| `confirm` | `string` | No | Leave it out to get a preview and a confirm value. Send that value back only after the person agreed to the preview. |

## Two-step confirmation

A call without `confirm` changes nothing. It returns `needs_confirmation: true`, a `preview` of the change, and a `confirm` value. Show the preview to the person. After they agree, call `create-payout` again with the same arguments and that `confirm` value. The value stays valid for at least 15 minutes, only while what the preview showed is unchanged, and only once. A stale value fails with `invalid_param` on `confirm`, and the error carries the new preview and confirm value. See [Conventions](/mcp/#conventions).

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
    "name": "fluent-affiliate-create-payout",
    "arguments": {
      "title": "value",
      "description": "value"
    }
  }
}
```
