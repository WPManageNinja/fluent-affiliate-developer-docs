---
title: Referrals
description: Action hooks in the Referrals category.
---

# Referrals

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/referral_marked_unpaid`](#fluent-affiliate-referral-marked-unpaid) | Fired after a referral's status is set to `unpaid` (ready for payout). |
| [`fluent_affiliate/referral/before_delete`](#fluent-affiliate-referral-before-delete) | Fired immediately before a referral record is deleted. |
| [`fluent_affiliate/referral/deleted`](#fluent-affiliate-referral-deleted) | Fired after a referral has been permanently deleted. |
| [`fluent_affiliate/referral_created`](#fluent-affiliate-referral-created) | Fired after a new referral record is inserted into the database. |
| [`fluent_affiliate/referral_marked_rejected`](#fluent-affiliate-referral-marked-rejected) | Fired after a referral is marked as rejected. |
| [`fluent_affiliate/referral_commission_updated`](#fluent-affiliate-referral-commission-updated) | Fired after the commission amount on an existing referral is updated. |

## `fluent_affiliate/referral_marked_unpaid`

Fired after a referral's status is set to `unpaid` (ready for payout).

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$referral` | `Referral` | The Referral model now in unpaid status. |

**Source:** `app/Http/Controllers/ReferralController.php`

```php
add_action('fluent_affiliate/referral_marked_unpaid', function($referral) {
    // Update an external ledger, send a notification, etc.
});
```

## `fluent_affiliate/referral/before_delete`

Fired immediately before a referral record is deleted.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$referral` | `Referral` | The Referral model about to be deleted. |

**Source:** `app/Http/Controllers/ReferralController.php`

```php
add_action('fluent_affiliate/referral/before_delete', function($referral) {
    // Archive or sync before deletion.
});
```

## `fluent_affiliate/referral/deleted`

Fired after a referral has been permanently deleted.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$id` | `int` | ID of the deleted referral. |
| `$affiliate` | `Affiliate` | The affiliate who owned the referral. |

**Source:** `app/Http/Controllers/ReferralController.php`

```php
add_action('fluent_affiliate/referral/deleted', function($id, $affiliate) {
    // Post-deletion cleanup.
}, 10, 2);
```

## `fluent_affiliate/referral_created`

Fired after a new referral record is inserted into the database.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$referral` | `Referral` | The new Referral model instance. |

**Source:** `app/Modules/Integrations/BaseConnector.php`

```php
add_action('fluent_affiliate/referral_created', function($referral) {
    // React to a new referral — e.g. send a notification.
});
```

## `fluent_affiliate/referral_marked_rejected`

Fired after a referral is marked as rejected.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$referral` | `Referral` | The rejected Referral model. |

**Source:** `app/Modules/Integrations/BaseConnector.php`

```php
add_action('fluent_affiliate/referral_marked_rejected', function($referral) {
    // Notify the affiliate or log the rejection.
});
```

## `fluent_affiliate/referral_commission_updated`

Fired after the commission amount on an existing referral is updated.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$referral` | `Referral` | The updated Referral model. |

**Source:** `app/Modules/Integrations/BaseConnector.php`

```php
add_action('fluent_affiliate/referral_commission_updated', function($referral) {
    // Sync the new amount to an external system.
});
```

