---
title: Creatives (Pro)
description: Filter hooks in the Creatives (Pro) category.
---

# Creatives (Pro)

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/create_creative_data`](#fluent-affiliate-create-creative-data) | Filters the creative data array before a new creative is inserted. |
| [`fluent_affiliate/update_creative_data`](#fluent-affiliate-update-creative-data) | Filters the creative data array before an existing creative is updated. |

## `fluent_affiliate/create_creative_data`

Filters the creative data array before a new creative is inserted.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$data` | `array` | Creative data including `name`, `type`, `url`, `privacy`, `affiliate_ids`, `group_ids`, `meta`. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_filter('fluent_affiliate/create_creative_data', function($data) {
    // Enforce max width for image creatives
    if ($data['type'] === 'image' && isset($data['meta']['media_width'])) {
        $data['meta']['media_width'] = min($data['meta']['media_width'], 728);
    }
    return $data;
});
```

## `fluent_affiliate/update_creative_data`

Filters the creative data array before an existing creative is updated.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$data` | `array` | Updated creative data including `name`, `type`, `url`, `privacy`, `affiliate_ids`, `group_ids`, `meta`. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_filter('fluent_affiliate/update_creative_data', function($data) {
    // Prevent type from being changed via the API
    unset($data['type']);
    return $data;
});
```

