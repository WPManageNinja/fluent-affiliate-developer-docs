---
title: Transaction Model
description: An individual payout transaction for a single affiliate within a payout batch.
---

# Transaction

An individual payout transaction for a single affiliate within a payout batch.

**Table:** `fa_payout_transactions`  
**Class:** `FluentAffiliate\\App\\Models\\Transaction.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `created_by` | `BIGINT(20)` | YES | — | WordPress user ID of the admin who created the payout. |
| `affiliate_id` | `BIGINT(20)` | YES | — | Affiliate who earned this referral. |
| `payout_id` | `BIGINT(20)` | YES | — | Parent payout record. |
| `total_amount` | `DOUBLE` | YES | `0` | Sum of all transactions in this payout. |
| `payout_method` | `VARCHAR(100)` | YES | `manual` | Delivery method — `manual`, `paypal`, etc. |
| `status` | `VARCHAR(100)` | YES | `paid` | Record status. |
| `currency` | `CHAR(3)` | YES | — | ISO 4217 currency code (e.g. `USD`). |
| `settings` | `LONGTEXT` | YES | — | Serialized JSON settings blob. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `affiliate()` | `belongsTo` | `Affiliate` | Affiliate receiving this payment. |
| `payout()` | `belongsTo` | `Payout` | Parent payout batch. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `ofStatus($status)` | Filter by `status`. |

## Usage Example

```php
use FluentAffiliate\App\Models\Transaction;

$paid = Transaction::ofStatus('paid')
    ->where('affiliate_id', $affiliateId)
    ->sum('total_amount');
```
