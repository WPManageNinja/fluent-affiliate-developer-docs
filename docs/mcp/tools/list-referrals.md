---
title: "List Referrals"
description: "List referrals (commissions) with affiliate, amount, order total, currency, status and source."
---

# List Referrals

List referrals (commissions) with affiliate, amount, order total, currency, status and source. Filter by affiliate, status, type, payout or date.

| | |
|---|---|
| **Ability** | `fluent-affiliate/list-referrals` |
| **MCP tool name** | `fluent-affiliate-list-referrals` |
| **Group** | Referrals |
| **Permission** | Read referrals: `manage_options`, or `read_all_referrals`, `manage_all_referrals` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `ReferralTools::listReferrals` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `affiliate_id` | `integer` | No |  |
| `status` | `string` | No | pending: not approved yet. unpaid: earned and owed. processing: in a payout a gateway is sending. paid: in a manual payout from the moment it is created (its transaction says whether you paid), or paid by a gateway. rejected: no commission. One of: `pending`, `unpaid`, `processing`, `paid`, `rejected`. |
| `type` | `string` | No | sale, opt_in, or a type an integration writes such as recurring_sale. |
| `provider` | `string` | No | Source integration, for example fluent_cart, woo or manual. |
| `payout_id` | `integer` | No | Referrals paid in this payout. |
| `created_from` | `string` | No | Date or date and time, site time unless it has an offset. |
| `created_to` | `string` | No | A bare date includes the whole day. |
| `search` | `string` | No | Part of the description, or the order id. |
| `sort_by` | `string` | No | Default created_at. One of: `created_at`, `amount`, `id`. |
| `sort_dir` | `string` | No | Default DESC. One of: `ASC`, `DESC`. |
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
    "name": "fluent-affiliate-list-referrals",
    "arguments": {}
  }
}
```
