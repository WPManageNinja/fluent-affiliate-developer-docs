---
title: "Get Referral"
description: "Read one referral: amount, order, customer, products, when it becomes payable, and its visit and payout when your permissions allow them."
---

# Get Referral

Read one referral: amount, order, customer, products, when it becomes payable, and its visit and payout when your permissions allow them. payable_from appears only while the referral is in the holding period.

| | |
|---|---|
| **Ability** | `fluent-affiliate/get-referral` |
| **MCP tool name** | `fluent-affiliate-get-referral` |
| **Group** | Referrals |
| **Permission** | Read referrals: `manage_options`, or `read_all_referrals`, `manage_all_referrals` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `ReferralTools::getReferral` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `integer` | Yes | Referral id. |

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
    "name": "fluent-affiliate-get-referral",
    "arguments": {
      "id": 1
    }
  }
}
```
