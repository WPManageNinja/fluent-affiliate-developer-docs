---
title: Payouts
description: Action hooks in the Payouts category.
---

# Payouts

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/payout/processed`](#fluent-affiliate-payout-processed) | Fired after a payout batch has been fully processed. |
| [`fluent_affiliate/payout/transaction/deleting`](#fluent-affiliate-payout-transaction-deleting) | Fired just before a payout transaction is deleted. |
| [`fluent_affiliate/payout/transaction/deleted`](#fluent-affiliate-payout-transaction-deleted) | Fired after a payout transaction has been deleted. |
| [`fluent_affiliate/payout/transaction/transaction_updated_to_{transaction}`](#fluent-affiliate-payout-transaction-transaction-updated-to-transaction) | See source. |

## `fluent_affiliate/payout/processed`

Fired after a payout batch has been fully processed.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$payout` | `Payout` | The Payout model that was processed. |
| `$affiliates` | `array` | Array of Affiliate models included in the payout. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_action('fluent_affiliate/payout/processed', function($payout, $affiliates) {
    foreach ($affiliates as $affiliate) {
        // Send payment notifications, trigger PayPal mass pay, etc.
    }
}, 10, 2);
```

## `fluent_affiliate/payout/transaction/deleting`

Fired just before a payout transaction is deleted.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$transaction` | `Transaction` | The Transaction model about to be deleted. |
| `$payout` | `Payout` | The parent Payout model. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_action('fluent_affiliate/payout/transaction/deleting', function($transaction, $payout) {
    // Reverse any external payment before deletion.
}, 10, 2);
```

## `fluent_affiliate/payout/transaction/deleted`

Fired after a payout transaction has been deleted.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$transactionId` | `int` | ID of the deleted transaction. |
| `$payout` | `Payout` | The parent Payout model. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_action('fluent_affiliate/payout/transaction/deleted', function($transactionId, $payout) {
    // Post-deletion audit logging.
}, 10, 2);
```

## `fluent_affiliate/payout/transaction/transaction_updated_to_{transaction}`

Dynamic hook — the suffix is determined at runtime. See source for exact usage.

**Source:** `app/Http/Controllers/PayoutController.php`

