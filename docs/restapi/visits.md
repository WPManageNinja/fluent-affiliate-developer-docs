---
title: Visits API
description: REST API endpoints for Visits.
---

# Visits

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/visits` | List affiliate visits. |
| `GET` | `/visits/export` | Export visits as CSV. |

## `GET /visits`

List affiliate visits.

**Auth:** Admin or affiliate with `fa_view_visits` capability  
**Controller:** `VisitController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/visits \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /visits/export`

Export visits as CSV.

**Auth:** Admin or affiliate with `fa_view_visits` capability  
**Controller:** `VisitController::export`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/visits/export \
  -H "X-WP-Nonce: YOUR_NONCE"
```

