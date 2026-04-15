---
title: Payout Model
description: A payout batch grouping multiple affiliate transactions.
---

# Payout

A payout batch grouping multiple affiliate transactions.

**Table:** `fa_payouts`  
**Class:** `FluentAffiliate\\App\\Models\\Payout.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `created_by` | `BIGINT(20)` | YES | — | WordPress user ID of the admin who created the payout. |
| `total_amount` | `DOUBLE` | YES | `NULL` | Sum of all transactions in this payout. |
| `payout_method` | `VARCHAR(100)` | YES | `manual` | Delivery method — `manual`, `paypal`, etc. |
| `status` | `VARCHAR(100)` | YES | `draft` | Record status. |
| `currency` | `CHAR(3)` | YES | — | ISO 4217 currency code (e.g. `USD`). |
| `title` | `VARCHAR(192)` | YES | — | Human-readable payout title. |
| `description` | `LONGTEXT` | YES | — | Free-text description. |
| `settings` | `LONGTEXT` | YES | — | Serialized JSON settings blob. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `transactions()` | `hasMany` | `Transaction` | Individual payout transactions in this batch. |
| `affiliates()` | `belongsToMany` | `Affiliate` | Affiliates included in this payout. |
| `referrals()` | `hasManyThrough` | `Referral` | Referrals covered by this payout. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `ofStatus($status)` | Filter by `status`. |
| `searchBy($search)` | Search by title or description. |

## Usage Example

```php
use FluentAffiliate\App\Models\Payout;

$processed = Payout::ofStatus('processed')
    ->with('transactions')
    ->orderBy('created_at', 'desc')
    ->get();
```
