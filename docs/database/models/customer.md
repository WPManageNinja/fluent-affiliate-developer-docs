---
title: Customer Model
description: A customer who made a purchase through an affiliate link.
---

# Customer

A customer who made a purchase through an affiliate link.

**Table:** `fa_customers`  
**Class:** `FluentAffiliate\\App\\Models\\Customer.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `user_id` | `BIGINT(20)` | YES | — | WordPress user ID of the affiliate. |
| `by_affiliate_id` | `BIGINT(20)` | YES | — | Affiliate who referred this customer. |
| `email` | `VARCHAR(192)` | YES | — | Customer email address. |
| `first_name` | `VARCHAR(192)` | YES | — | Customer first name. |
| `last_name` | `VARCHAR(192)` | YES | — | Customer last name. |
| `ip` | `VARCHAR(100)` | YES | — | Hashed or raw visitor IP address. |
| `settings` | `LONGTEXT` | YES | — | Serialized JSON settings blob. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `affiliate()` | `belongsTo` | `Affiliate` | The affiliate who referred this customer. |
| `referrals()` | `hasMany` | `Referral` | All referrals from this customer. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `searchBy($search)` | Search by email, first name, or last name. |

## Usage Example

```php
use FluentAffiliate\App\Models\Customer;

$customer = Customer::where('email', $email)->first();
```
