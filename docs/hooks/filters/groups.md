---
title: Groups (Pro)
description: Filter hooks in the Groups (Pro) category.
---

# Groups (Pro)

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/create_affiliate_group_data_value`](#fluent-affiliate-create-affiliate-group-data-value) | Filters the serialised value stored in `fa_meta` when a new affiliate group is created. |
| [`fluent_affiliate/update_affiliate_group_data_value`](#fluent-affiliate-update-affiliate-group-data-value) | Filters the serialised value stored in `fa_meta` when an existing affiliate group is updated. |

## `fluent_affiliate/create_affiliate_group_data_value`

Filters the serialised value stored in `fa_meta` when a new affiliate group is created.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$value` | `array` | Group value array: `rate_type`, `rate`, `status`, `notes`. |
| `$data` | `array` | The full incoming request data. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/AffiliateGroupController.php`

```php
add_filter('fluent_affiliate/create_affiliate_group_data_value', function($value, $data) {
    // Add a custom field to every new group
    $value['custom_tier'] = sanitize_text_field($data['custom_tier'] ?? 'standard');
    return $value;
}, 10, 2);
```

## `fluent_affiliate/update_affiliate_group_data_value`

Filters the serialised value stored in `fa_meta` when an existing affiliate group is updated.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$value` | `array` | Group value array with updated fields. |
| `$group` | `AffiliateGroup` | The existing group model being updated. |
| `$data` | `array` | The full incoming request data. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/AffiliateGroupController.php`

```php
add_filter('fluent_affiliate/update_affiliate_group_data_value', function($value, $group, $data) {
    return $value;
}, 10, 3);
```

