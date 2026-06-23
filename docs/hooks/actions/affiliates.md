---
title: Affiliates
description: Action hooks in the Affiliates category.
---

# Affiliates

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/admin_app_rendering`](#fluent-affiliate-admin-app-rendering) | Fired just before the admin SPA is rendered. |
| [`fluent_affiliate/affiliate_updated`](#fluent-affiliate-affiliate-updated) | Fired after an affiliate record is updated by an admin. |
| [`fluent_affiliate/before_delete_affiliate`](#fluent-affiliate-before-delete-affiliate) | Fires immediately before an affiliate is permanently deleted. |
| [`fluent_affiliate/after_delete_affiliate`](#fluent-affiliate-after-delete-affiliate) | Fires after an affiliate has been permanently deleted. |
| [`fluent_affiliate/affiliate_status_to_{status}`](#fluent-affiliate-affiliate-status-to-status) | Fired when an affiliate's status changes. |
| [`fluent_affiliate/affiliate_created`](#fluent-affiliate-affiliate-created) | Fired after a new affiliate record is created. |
| [`fluent_affiliate/affiliate_status_to_active`](#fluent-affiliate-affiliate-status-to-active) | See source. |

## `fluent_affiliate/admin_app_rendering`

Fired just before the admin SPA is rendered. Useful for adding custom scripts or data.

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_action('fluent_affiliate/admin_app_rendering', function() {
    wp_enqueue_script('my-admin-extension', MY_PLUGIN_URL . 'admin-ext.js', ['jquery'], '1.0', true);
});
```

## `fluent_affiliate/affiliate_updated`

Fired after an affiliate record is updated by an admin.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate` | The updated Affiliate model. |
| `$by` | `string` | Who triggered the update — `"by_admin"`. |
| `$data` | `array` | Array of changed data. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_action('fluent_affiliate/affiliate_updated', function($affiliate, $by, $data) {
    // Log the change or notify an external system.
}, 10, 3);
```

## `fluent_affiliate/before_delete_affiliate`

Fires immediately before an affiliate is permanently deleted.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate` | The affiliate about to be deleted. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_action('fluent_affiliate/before_delete_affiliate', function($affiliate) {
    error_log('Deleting affiliate #' . $affiliate->id);
});
```

## `fluent_affiliate/after_delete_affiliate`

Fires after an affiliate has been permanently deleted.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliateId` | `int` | The ID of the deleted affiliate. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_action('fluent_affiliate/after_delete_affiliate', function($affiliateId) {
    // Clean up related custom data.
});
```

## `fluent_affiliate/affiliate_status_to_{status}`

Fired when an affiliate's status changes. The hook name is dynamic: the suffix is the **new** status (e.g. `active`, `inactive`, `banned`).

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate` | The Affiliate model with its new status. |
| `$prevStatus` | `string` | The previous status, or an empty string on first activation. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
// Fires for any status change
add_action('fluent_affiliate/affiliate_status_to_active', function($affiliate, $prevStatus) {
    // e.g. send a "you're approved" email
}, 10, 2);
```

## `fluent_affiliate/affiliate_created`

Fired after a new affiliate record is created.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate` | The newly created Affiliate model instance. |
| `$user` | `User` | The WordPress User model associated with the affiliate. |

**Source:** `app/Models/User.php`

```php
add_action('fluent_affiliate/affiliate_created', function($affiliate, $user) {
    // Send a welcome email, sync to CRM, etc.
    my_plugin_send_affiliate_welcome($affiliate->payment_email);
}, 10, 2);
```

## `fluent_affiliate/affiliate_status_to_active`

**Source:** `app/Models/User.php`

