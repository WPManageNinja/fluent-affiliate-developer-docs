---
title: Portal API
description: REST API endpoints for Portal.
---

# Portal

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/portalstats` | PortalController::getStats |
| `GET` | `/portalreferrals` | PortalController::getReferrals |
| `GET` | `/portaltransactions` | PortalController::getTransactions |
| `GET` | `/portalvisits` | PortalController::getVisits |
| `GET` | `/portalsettings` | PortalController::getSettings |
| `POST` | `/portalsettings` | PortalController::updateSettings |

## `GET /portalstats`

PortalController::getStats

**Auth:** Any authenticated WordPress user  
**Controller:** `PortalController::getStats`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/portalstats \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /portalreferrals`

PortalController::getReferrals

**Auth:** Any authenticated WordPress user  
**Controller:** `PortalController::getReferrals`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/portalreferrals \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /portaltransactions`

PortalController::getTransactions

**Auth:** Any authenticated WordPress user  
**Controller:** `PortalController::getTransactions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/portaltransactions \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /portalvisits`

PortalController::getVisits

**Auth:** Any authenticated WordPress user  
**Controller:** `PortalController::getVisits`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/portalvisits \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /portalsettings`

PortalController::getSettings

**Auth:** Any authenticated WordPress user  
**Controller:** `PortalController::getSettings`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/portalsettings \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /portalsettings`

PortalController::updateSettings

**Auth:** Any authenticated WordPress user  
**Controller:** `PortalController::updateSettings`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/portalsettings \
  -H "X-WP-Nonce: YOUR_NONCE"
```

