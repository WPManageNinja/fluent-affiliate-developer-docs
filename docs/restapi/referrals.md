---
title: Referrals API
description: REST API endpoints for Referrals.
---

# Referrals

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/referrals` | List referrals with filters. |
| `GET` | `/referrals/export` | Export referrals as CSV. |
| `POST` | `/referrals` | Manually create a referral. |
| `GET` | `/referrals/{id}` | Retrieve a single referral. |
| `PATCH` | `/referrals/{id}` | Update a referral. |
| `DELETE` | `/referrals/{id}` | Delete a referral. |

## `GET /referrals`

List referrals with filters.

**Auth:** Admin or affiliate with `fa_view_referrals` capability  
**Controller:** `ReferralController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/referrals \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /referrals/export`

Export referrals as CSV.

**Auth:** Admin or affiliate with `fa_view_referrals` capability  
**Controller:** `ReferralController::export`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/referrals/export \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /referrals`

Manually create a referral.

**Auth:** Admin or affiliate with `fa_view_referrals` capability  
**Controller:** `ReferralController::createReferral`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/referrals \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /referrals/{id}`

Retrieve a single referral.

**Auth:** Admin or affiliate with `fa_view_referrals` capability  
**Controller:** `ReferralController::show`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/referrals/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /referrals/{id}`

Update a referral.

**Auth:** Admin or affiliate with `fa_view_referrals` capability  
**Controller:** `ReferralController::update`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/referrals/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /referrals/{id}`

Delete a referral.

**Auth:** Admin or affiliate with `fa_view_referrals` capability  
**Controller:** `ReferralController::destroy`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/referrals/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

