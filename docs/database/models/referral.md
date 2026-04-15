---
title: Referral Model
description: Represents a commission event generated when a referred visitor completes a qualifying action.
---

# Referral

Represents a commission event generated when a referred visitor completes a qualifying action.

**Table:** `fa_referrals`  
**Class:** `FluentAffiliate\\App\\Models\\Referral.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `affiliate_id` | `BIGINT(20)` | YES | — | Affiliate who earned this referral. |
| `parent_id` | `BIGINT(20)` | YES | — | Parent referral ID (for multi-tier, reserved). |
| `customer_id` | `BIGINT(20)` | YES | — | Customer record associated with this purchase. |
| `visit_id` | `BIGINT(20)` | YES | — | Visit that initiated this referral (if known). |
| `description` | `LONGTEXT` | YES | — | Free-text description. |
| `status` | `VARCHAR(100)` | YES | `pending` | Record status. |
| `amount` | `DOUBLE` | YES | `NULL` | Commission amount earned by the affiliate. |
| `order_total` | `DOUBLE` | YES | `NULL` | Total order value that generated the referral. |
| `currency` | `CHAR(3)` | YES | — | ISO 4217 currency code (e.g. `USD`). |
| `utm_campaign` | `VARCHAR(100)` | YES | — | UTM campaign parameter from the tracking URL. |
| `provider` | `VARCHAR(100)` | YES | — | Integration slug that created this referral (e.g. `woo`, `fluentcart`). |
| `provider_id` | `BIGINT(20)` | YES | — | Provider-specific order/payment numeric ID. |
| `provider_sub_id` | `VARCHAR(192)` | YES | — | Provider-specific sub-ID (e.g. subscription ID). |
| `products` | `LONGTEXT` | YES | — | JSON list of product IDs in the order. |
| `payout_transaction_id` | `BIGINT(20)` | YES | — | Payout transaction that included this referral. |
| `payout_id` | `BIGINT(20)` | YES | — | Parent payout record. |
| `type` | `VARCHAR(100)` | YES | `sale` | Creative type — `image`, `text`, `html`, `banner`. |
| `settings` | `LONGTEXT` | YES | — | Serialized JSON settings blob. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `affiliate()` | `belongsTo` | `Affiliate` | Affiliate who earned this referral. |
| `customer()` | `belongsTo` | `Customer` | Customer who made the purchase. |
| `visit()` | `belongsTo` | `Visit` | Click-through visit that led to this referral. |
| `payout()` | `belongsTo` | `Payout` | Payout batch that paid this referral. |
| `transaction()` | `belongsTo` | `Transaction` | Payout transaction record. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `ofStatus($status)` | Filter by `status`. |
| `searchBy($search)` | Search across description and provider fields. |
| `filterByAffiliate($id)` | Restrict to a specific affiliate. |

## Usage Example

```php
use FluentAffiliate\App\Models\Referral;

$unpaid = Referral::ofStatus('unpaid')
    ->where('affiliate_id', $affiliateId)
    ->sum('amount');
```
