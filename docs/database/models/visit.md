---
title: Visit Model
description: Tracks each click of an affiliate referral link.
---

# Visit

Tracks each click of an affiliate referral link.

**Table:** `fa_visits`  
**Class:** `FluentAffiliate\\App\\Models\\Visit.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `affiliate_id` | `BIGINT(20)` | YES | — | Affiliate who earned this referral. |
| `user_id` | `BIGINT(20)` | YES | — | WordPress user ID of the affiliate. |
| `referral_id` | `BIGINT(20)` | YES | — | Referral created from this visit (if any). |
| `url` | `MEDIUMTEXT` | YES | — | Destination URL linked from the creative. |
| `referrer` | `MEDIUMTEXT` | YES | — | HTTP referer of the visit. |
| `utm_campaign` | `VARCHAR(100)` | YES | — | UTM campaign parameter from the tracking URL. |
| `utm_medium` | `VARCHAR(100)` | YES | — | UTM medium parameter. |
| `utm_source` | `VARCHAR(100)` | YES | — | UTM source parameter. |
| `ip` | `VARCHAR(100)` | YES | — | Hashed or raw visitor IP address. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `affiliate()` | `belongsTo` | `Affiliate` | Affiliate whose link was clicked. |
| `referral()` | `hasOne` | `Referral` | Referral created from this visit (if any). |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `filterByAffiliate($id)` | Restrict to a specific affiliate. |
| `filterByCampaign($campaign)` | Filter by UTM campaign. |

## Usage Example

```php
use FluentAffiliate\App\Models\Visit;

$visits = Visit::filterByAffiliate($affiliateId)
    ->whereBetween('created_at', [$startDate, $endDate])
    ->count();
```
