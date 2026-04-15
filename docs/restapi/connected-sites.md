---
title: Connected Sites API
description: REST API endpoints for Connected Sites.
---

# Connected Sites

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/connected-sitesconnected-sites-config` | DomainController::getConnectedConfig |
| `PATCH` | `/connected-sitesconnected-sites-config` | DomainController::updateGlobalStatus |
| `PATCH` | `/connected-sitesconnected-sites-config/update` | DomainController::patchSingleSiteConfig |
| `POST` | `/connected-sitesconnected-sites-config/issue` | DomainController::validateAndIssueNewSiteToken |
| `POST` | `/connected-sitesconnected-sites-config/disconnect` | DomainController::disconnectSite |

## `GET /connected-sitesconnected-sites-config`

DomainController::getConnectedConfig

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `DomainController::getConnectedConfig`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/connected-sitesconnected-sites-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /connected-sitesconnected-sites-config`

DomainController::updateGlobalStatus

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `DomainController::updateGlobalStatus`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/connected-sitesconnected-sites-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /connected-sitesconnected-sites-config/update`

DomainController::patchSingleSiteConfig

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `DomainController::patchSingleSiteConfig`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/connected-sitesconnected-sites-config/update \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /connected-sitesconnected-sites-config/issue`

DomainController::validateAndIssueNewSiteToken

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `DomainController::validateAndIssueNewSiteToken`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/connected-sitesconnected-sites-config/issue \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /connected-sitesconnected-sites-config/disconnect`

DomainController::disconnectSite

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `DomainController::disconnectSite`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/connected-sitesconnected-sites-config/disconnect \
  -H "X-WP-Nonce: YOUR_NONCE"
```

