---
title: "Update Affiliate"
description: "Approve, deactivate or change an affiliate: status, commission rate and note."
---

# Update Affiliate

Approve, deactivate or change an affiliate: status, commission rate and note. It acts at once, with no preview; a status change emails the affiliate. Only the fields you pass change. A new rate applies to referrals created from now on.

| | |
|---|---|
| **Ability** | `fluent-affiliate/update-affiliate` |
| **MCP tool name** | `fluent-affiliate-update-affiliate` |
| **Group** | Affiliates |
| **Permission** | Manage affiliates: `manage_options`, or `manage_all_affiliates` or `manage_all_data` |
| **Type** | Write |
| **Runs** | `AffiliateTools::updateAffiliate` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `integer` | Yes | Affiliate id. |
| `status` | `string` | No | active approves the affiliate; inactive stops new commissions. One of: `pending`, `active`, `inactive`. |
| `note` | `string` | No | Internal note, shown to staff only. Replaces the note. |
| `payment_email` | `string` | No | Refused: where an affiliate is paid changes only in the admin screen. |
| `bank_details` | `string` | No | Refused: where an affiliate is paid changes only in the admin screen. |
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
    "name": "fluent-affiliate-update-affiliate",
    "arguments": {
      "id": 1
    }
  }
}
```
