---
title: Reports API
description: Dashboard statistics, chart data, advanced commerce reports, and report provider listing.
---

# Reports API

Dashboard statistics, chart data, advanced commerce reports, and report provider listing.

## Authentication

Reports routes use `UserPolicy`. Dashboard stats require admin access; advanced report access depends on user capabilities.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/reports/advanced-providers` | Core | [List Advanced Providers](/restapi/operations/reports/list-advanced-providers) | `ReportsController@getAdvancedReportProviders` |
| `GET` | `/reports/commerce-reports/{provider}` | Core | [Get Commerce Report](/restapi/operations/reports/get-commerce-report) | `ReportsController@getReports` |
| `GET` | `/reports/dashboard-stats` | Core | [Get Dashboard Stats](/restapi/operations/reports/get-dashboard-stats) | `DashboardController@getStats` |
| `GET` | `/reports/dashboard-chart-stats` | Core | [Get Dashboard Chart Stats](/restapi/operations/reports/get-dashboard-chart-stats) | `DashboardController@getChartStats` |

