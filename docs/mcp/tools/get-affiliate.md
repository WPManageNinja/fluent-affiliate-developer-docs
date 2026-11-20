---
title: "Get Affiliate"
description: "Read one affiliate: profile, commission rate, earnings, referral link and note."
---

# Get Affiliate

Read one affiliate: profile, commission rate, earnings, referral link and note. include adds recent referrals and payout transactions, when your permissions allow them.

| | |
|---|---|
| **Ability** | `fluent-affiliate/get-affiliate` |
| **MCP tool name** | `fluent-affiliate-get-affiliate` |
| **Group** | Affiliates |
| **Permission** | Read affiliates: `manage_options`, or `read_all_affiliates`, `manage_all_affiliates` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `AffiliateTools::getAffiliate` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `integer` | Yes | Affiliate id. |
| `include` | `string[]` | No | The 10 newest of each. One of: `recent_referrals`, `recent_transactions`. |

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
    "name": "fluent-affiliate-get-affiliate",
    "arguments": {
      "id": 1
    }
  }
}
```
