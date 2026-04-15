---
title: Affiliate Model
description: Represents a registered affiliate. Central model in FluentAffiliate.
---

# Affiliate

Represents a registered affiliate. Central model in FluentAffiliate.

**Table:** `fa_affiliates`  
**Class:** `FluentAffiliate\\App\\Models\\Affiliate.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `contact_id` | `BIGINT(20)` | YES | — | Optional FluentCRM contact ID linked to this affiliate. |
| `user_id` | `BIGINT(20)` | YES | — | WordPress user ID of the affiliate. |
| `group_id` | `BIGINT(20)` | YES | — | Affiliate group ID (Pro feature). |
| `rate` | `DOUBLE` | YES | `NULL` | Commission rate. Interpretation depends on `rate_type`. |
| `total_earnings` | `DOUBLE` | YES | `0` | Cumulative lifetime earnings (denormalised). |
| `unpaid_earnings` | `DOUBLE` | YES | `0` | Earnings not yet included in a paid payout. |
| `referrals` | `BIGINT(20)` | YES | `0` | Total referral count (denormalised). |
| `visits` | `BIGINT(20)` | YES | `0` | Total visit count (denormalised). |
| `lead_counts` | `BIGINT(20)` | YES | `0` | Total lead count (denormalised). |
| `rate_type` | `VARCHAR(100)` | YES | `percentage` | Commission type — `percentage` or `flat`. |
| `custom_param` | `VARCHAR(100)` | YES | — | Custom URL parameter value used for tracking. |
| `payment_email` | `VARCHAR(192)` | YES | — | Email address used for payout delivery. |
| `status` | `VARCHAR(100)` | YES | `active` | Record status. |
| `settings` | `LONGTEXT` | YES | — | Serialized JSON settings blob. |
| `note` | `LONGTEXT` | YES | — | Internal admin notes about the affiliate. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `user()` | `belongsTo` | `User` | WordPress user owning this affiliate account. |
| `referrals()` | `hasMany` | `Referral` | All referrals attributed to this affiliate. |
| `visits()` | `hasMany` | `Visit` | All tracked visits attributed to this affiliate. |
| `transactions()` | `hasMany` | `Transaction` | All payout transactions for this affiliate. |
| `payouts()` | `belongsToMany` | `Payout` | Payouts that include this affiliate. |
| `group()` | `belongsTo` | `AffiliateGroup` | Affiliate group (Pro). |
| `meta()` | `hasMany` | `Meta` | Meta key-value pairs for this affiliate. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `ofStatus($status)` | Filter by `status`. |
| `searchBy($search)` | Full-text search across user email/name and `custom_param`. |
| `filterByGroups($ids)` | Restrict to affiliates in the given group IDs. |

## Usage Example

```php
use FluentAffiliate\App\Models\Affiliate;

// Active affiliates with earnings
$affiliates = Affiliate::ofStatus('active')
    ->where('unpaid_earnings', '>', 0)
    ->orderBy('total_earnings', 'desc')
    ->get();
```
