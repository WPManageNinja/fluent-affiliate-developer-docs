---
title: "Get Report"
description: "Affiliate program results for a date range: referrals and commissions by status, order value, visits, conversion, new affiliates and top affiliates."
---

# Get Report

Affiliate program results for a date range: referrals and commissions by status, order value, visits, conversion, new affiliates and top affiliates. Counted by creation date. top_affiliates: the 5 largest commission totals (unpaid, processing and paid), one row per affiliate and currency. Conversion: visits that a referral points to, divided by all visits in the range, as a percent; 0 when there are no visits. paid_out: transactions marked paid in the range.

| | |
|---|---|
| **Ability** | `fluent-affiliate/get-report` |
| **MCP tool name** | `fluent-affiliate-get-report` |
| **Group** | Reports |
| **Permission** | Any FluentAffiliate permission: `manage_options`, or `PermissionManager::hasAnyPermission()` |
| **Type** | Read-only |
| **Runs** | `ReportTools::getReport` |

## Input

| Parameter | Type | Required | Description |
|---|---|---|---|
| `from` | `string` | No | Date, site time. Default 30 days ago. |
| `to` | `string` | No | Date, site time, included. Default today. |

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
    "name": "fluent-affiliate-get-report",
    "arguments": {}
  }
}
```
