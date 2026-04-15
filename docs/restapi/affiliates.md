---
title: Affiliates API
description: REST API endpoints for Affiliates.
---

# Affiliates

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/affiliates` | List all affiliates with pagination and filters. |
| `GET` | `/affiliates/export` | Export affiliates as a CSV file. |
| `POST` | `/affiliates` | Create a new affiliate. |
| `GET` | `/affiliates/{id}` | Retrieve a single affiliate by ID. |
| `DELETE` | `/affiliates/{id}` | Permanently delete an affiliate. |
| `PATCH` | `/affiliates/{id}` | Update an affiliate's settings. |
| `PATCH` | `/affiliates/{id}/status` | Change an affiliate's status. |
| `GET` | `/affiliates/{id}/transactions` | List payout transactions for an affiliate. |
| `GET` | `/affiliates/{id}/visits` | List visits for an affiliate. |
| `GET` | `/affiliates/{id}/referrals` | List referrals for an affiliate. |
| `GET` | `/affiliates/{id}/stats` | Get summary stats for an affiliate. |
| `GET` | `/affiliates/{id}/statistics` | Get detailed statistics for an affiliate. |

## `GET /affiliates`

List all affiliates with pagination and filters.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/export`

Export affiliates as a CSV file.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::export`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/export \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /affiliates`

Create a new affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::createAffiliate`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/{id}`

Retrieve a single affiliate by ID.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::getAffiliate`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /affiliates/{id}`

Permanently delete an affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::deleteAffiliate`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /affiliates/{id}`

Update an affiliate's settings.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::updateAffiliate`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /affiliates/{id}/status`

Change an affiliate's status.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::updateAffiliateStatus`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1/status \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/{id}/transactions`

List payout transactions for an affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::getTransactions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1/transactions \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/{id}/visits`

List visits for an affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::getVisits`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1/visits \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/{id}/referrals`

List referrals for an affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::getReferrals`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1/referrals \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/{id}/stats`

Get summary stats for an affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::getOverviewStats`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1/stats \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /affiliates/{id}/statistics`

Get detailed statistics for an affiliate.

**Auth:** Admin or affiliate with `fa_view_affiliates` capability  
**Controller:** `AffiliateController::statistics`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/1/statistics \
  -H "X-WP-Nonce: YOUR_NONCE"
```

