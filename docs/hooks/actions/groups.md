---
title: Groups (Pro)
description: Action hooks in the Groups (Pro) category.
---

# Groups (Pro)

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/before_create_affiliate_group`](#fluent-affiliate-before-create-affiliate-group) | Fired immediately before a new affiliate group is saved to the database. |
| [`fluent_affiliate/before_delete_affiliate_group`](#fluent-affiliate-before-delete-affiliate-group) | Fired immediately before an affiliate group is permanently deleted. |
| [`fluent_affiliate/after_delete_affiliate_group`](#fluent-affiliate-after-delete-affiliate-group) | Fired after an affiliate group has been permanently deleted. |

## `fluent_affiliate/before_create_affiliate_group`

Fired immediately before a new affiliate group is saved to the database.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$data` | `array` | The group data about to be saved: `meta_key` (name), `rate_type`, `rate`, `status`, `notes`. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/AffiliateGroupController.php`

```php
add_action('fluent_affiliate/before_create_affiliate_group', function($data) {
    // Validate or log the incoming group data
    error_log('Creating group: ' . $data['meta_key']);
});
```

## `fluent_affiliate/before_delete_affiliate_group`

Fired immediately before an affiliate group is permanently deleted.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$group` | `AffiliateGroup` | The AffiliateGroup model about to be deleted. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/AffiliateGroupController.php`

```php
add_action('fluent_affiliate/before_delete_affiliate_group', function($group) {
    // Migrate affiliates in this group to a default group
    Affiliate::where('group_id', $group->id)->update(['group_id' => 0]);
});
```

## `fluent_affiliate/after_delete_affiliate_group`

Fired after an affiliate group has been permanently deleted.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliateGroup` | `AffiliateGroup` | The AffiliateGroup model that was deleted (read-only at this point). |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/AffiliateGroupController.php`

```php
add_action('fluent_affiliate/after_delete_affiliate_group', function($affiliateGroup) {
    // Remove external records for this group
    delete_option('my_plugin_group_' . $affiliateGroup->id . '_config');
});
```

