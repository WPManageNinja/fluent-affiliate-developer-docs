---
title: "List Visits"
description: "List visits (clicks on referral links) with landing page, referrer, UTM tags and the referral they led to."
---

# List Visits

List visits (clicks on referral links) with landing page, referrer, UTM tags and the referral they led to. Filter by affiliate, conversion or date.

| | |
|---|---|
| **Ability** | `fluent-affiliate/list-visits` |
| **MCP tool name** | `fluent-affiliate-list-visits` |
| **Group** | Visits |
| **Permission** | Read visits: `manage_options`, or `read_all_visits` or `manage_all_data` |
| **Type** | Read-only |
| **Runs** | `VisitTools::listVisits` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `affiliate_id` | `integer` | No |  |
| `converted` | `boolean` | No | true: visits that led to a referral. false: visits that did not. |
| `created_from` | `string` | No | Date or date and time, site time unless it has an offset. |
| `created_to` | `string` | No | A bare date includes the whole day. |
| `search` | `string` | No | Part of the url, referrer, utm_campaign, utm_source or utm_medium; any of them may match. |
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
    "name": "fluent-affiliate-list-visits",
    "arguments": {}
  }
}
```
