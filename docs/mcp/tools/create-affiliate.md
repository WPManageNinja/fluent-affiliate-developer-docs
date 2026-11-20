---
title: "Create Affiliate"
description: "Make an existing WordPress user an affiliate."
---

# Create Affiliate

Make an existing WordPress user an affiliate. It does not create WordPress users. It acts at once: status=active emails the new affiliate as an approval would.

| | |
|---|---|
| **Ability** | `fluent-affiliate/create-affiliate` |
| **MCP tool name** | `fluent-affiliate-create-affiliate` |
| **Group** | Affiliates |
| **Permission** | Manage affiliates: `manage_options`, or `manage_all_affiliates` or `manage_all_data` |
| **Type** | Write |
| **Runs** | `AffiliateTools::createAffiliate` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_id` | `integer` | Yes | WordPress user id. |
| `status` | `string` | Yes | One of: `pending`, `active`, `inactive`. |
| `payment_email` | `string` | No | Where payouts go. Required when the site pays by PayPal or by hand (the default). |
| `bank_details` | `string` | No | Required when the site pays by bank transfer. |
| `rate_type` | `string` | No | default: the site rate. flat: a fixed amount per referral. percentage: a share of the order. group: the rate of group_id. One of: `default`, `group`, `flat`, `percentage`. `group` needs Pro. |
| `rate` | `number` | No | Required with rate_type flat or percentage. A percentage is 10 for 10%. Minimum 0. |
| `group_id` <span class="pro-badge">PRO</span> | `integer` | No | Required with rate_type group. |

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
    "name": "fluent-affiliate-create-affiliate",
    "arguments": {
      "user_id": 1,
      "status": "pending"
    }
  }
}
```
