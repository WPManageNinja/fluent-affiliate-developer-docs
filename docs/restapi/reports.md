---
title: Reports API
description: REST API endpoints for Reports.
---

# Reports

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/reportsadvanced-providers` | ReportsController::getAdvancedReportProviders |
| `GET` | `/reportscommerce-reports/{provider}` | ReportsController::getReports |
| `GET` | `/reportsdashboard-stats` | DashboardController::getStats |
| `GET` | `/reportsdashboard-chart-stats` | DashboardController::getChartStats |

## `GET /reportsadvanced-providers`

ReportsController::getAdvancedReportProviders

**Auth:** Any authenticated WordPress user  
**Controller:** `ReportsController::getAdvancedReportProviders`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/reportsadvanced-providers \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /reportscommerce-reports/{provider}`

ReportsController::getReports

**Auth:** Any authenticated WordPress user  
**Controller:** `ReportsController::getReports`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/reportscommerce-reports/VALUE \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /reportsdashboard-stats`

DashboardController::getStats

**Auth:** Any authenticated WordPress user  
**Controller:** `DashboardController::getStats`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/reportsdashboard-stats \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /reportsdashboard-chart-stats`

DashboardController::getChartStats

**Auth:** Any authenticated WordPress user  
**Controller:** `DashboardController::getChartStats`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/reportsdashboard-chart-stats \
  -H "X-WP-Nonce: YOUR_NONCE"
```

