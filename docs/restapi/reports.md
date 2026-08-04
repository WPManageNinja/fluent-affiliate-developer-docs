---
title: Reports API
description: Dashboard KPI statistics and dashboard chart time-series data.
---

# Reports API

Dashboard KPI statistics and dashboard chart time-series data.

## Authentication

Reports routes are protected by `ReportPolicy`, which grants access to any user holding at least one FluentAffiliate permission (`PermissionManager::hasAnyPermission()`).

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/reports/dashboard-stats` | Core | [Get Dashboard Stats](/restapi/operations/reports/get-dashboard-stats) | `DashboardController@getStats` |
| `GET` | `/reports/dashboard-chart-stats` | Core | [Get Dashboard Chart Stats](/restapi/operations/reports/get-dashboard-chart-stats) | `DashboardController@getChartStats` |

