---
title: Creatives API
description: REST API endpoints for Creatives.
---

# Creatives

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/creatives/creatives` | CreativeController::index |
| `GET` | `/creatives/creatives/{id}` | CreativeController::show |
| `POST` | `/creatives/creatives` | CreativeController::store |
| `PATCH` | `/creatives/creatives/{id}` | CreativeController::update |
| `DELETE` | `/creatives/creatives/{id}` | CreativeController::destroy |
| `GET` | `/creativescreatives` | CreativeController::portalCreatives |

## `GET /creatives/creatives`

CreativeController::index

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `CreativeController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/creatives/creatives \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /creatives/creatives/{id}`

CreativeController::show

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `CreativeController::show`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/creatives/creatives/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /creatives/creatives`

CreativeController::store

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `CreativeController::store`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/creatives/creatives \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /creatives/creatives/{id}`

CreativeController::update

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `CreativeController::update`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/creatives/creatives/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /creatives/creatives/{id}`

CreativeController::destroy

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `CreativeController::destroy`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/creatives/creatives/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /creativescreatives`

CreativeController::portalCreatives

**Auth:** Any authenticated WordPress user  
**Controller:** `CreativeController::portalCreatives`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/creativescreatives \
  -H "X-WP-Nonce: YOUR_NONCE"
```

