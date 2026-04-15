---
title: License API
description: REST API endpoints for License.
---

# License

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/license/license` | LicenseController::getStatus |
| `POST` | `/license/license` | LicenseController::saveLicense |
| `DELETE` | `/license/license` | LicenseController::deactivateLicense |

## `GET /license/license`

LicenseController::getStatus

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `LicenseController::getStatus`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/license/license \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /license/license`

LicenseController::saveLicense

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `LicenseController::saveLicense`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/license/license \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /license/license`

LicenseController::deactivateLicense

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `LicenseController::deactivateLicense`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/license/license \
  -H "X-WP-Nonce: YOUR_NONCE"
```

