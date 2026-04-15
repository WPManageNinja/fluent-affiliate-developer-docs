---
title: Affiliate Groups API
description: REST API endpoints for Affiliate Groups.
---

# Affiliate Groups

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/groups/groups` | AffiliateGroupController::index |
| `POST` | `/groups/groups` | AffiliateGroupController::store |
| `PATCH` | `/groups/groups/{id}` | AffiliateGroupController::update |
| `GET` | `/groups/groups/{id}` | AffiliateGroupController::show |
| `GET` | `/groups/groups/{id}/affiliates` | AffiliateGroupController::affiliates |
| `GET` | `/groups/groups/{id}/overview` | AffiliateGroupController::overview |
| `GET` | `/groups/groups/{id}/statistics` | AffiliateGroupController::statistics |
| `DELETE` | `/groups/groups/{id}` | AffiliateGroupController::destroy |

## `GET /groups/groups`

AffiliateGroupController::index

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /groups/groups`

AffiliateGroupController::store

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::store`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /groups/groups/{id}`

AffiliateGroupController::update

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::update`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /groups/groups/{id}`

AffiliateGroupController::show

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::show`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /groups/groups/{id}/affiliates`

AffiliateGroupController::affiliates

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::affiliates`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups/1/affiliates \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /groups/groups/{id}/overview`

AffiliateGroupController::overview

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::overview`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups/1/overview \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /groups/groups/{id}/statistics`

AffiliateGroupController::statistics

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::statistics`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups/1/statistics \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /groups/groups/{id}`

AffiliateGroupController::destroy

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `AffiliateGroupController::destroy`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/groups/groups/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

