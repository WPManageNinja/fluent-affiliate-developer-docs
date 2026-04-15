---
title: Creatives (Pro)
description: Action hooks in the Creatives (Pro) category.
---

# Creatives (Pro)

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/creative_status_changed`](#fluent-affiliate-creative-status-changed) | Fired when a creative's status transitions (e. |
| [`fluent_affiliate/after_create_creative`](#fluent-affiliate-after-create-creative) | Fired after a new creative asset has been saved to the database. |
| [`fluent_affiliate/creative_updated`](#fluent-affiliate-creative-updated) | Fired after a creative asset has been updated. |
| [`fluent_affiliate/before_delete_creative`](#fluent-affiliate-before-delete-creative) | Fired immediately before a creative asset is permanently deleted. |
| [`fluent_affiliate/after_delete_creative`](#fluent-affiliate-after-delete-creative) | Fired after a creative asset has been permanently deleted. |

## `fluent_affiliate/creative_status_changed`

Fired when a creative's status transitions (e.g. scheduled → active, active → expired). Triggered by the Action Scheduler jobs.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$creative` | `Creative` | The Creative model with its updated status. |
| `$newStatus` | `string` | The new status: `active` or `expired`. |

**Source:** `../fluent-affiliate-pro/app/Hooks/Handlers/CreativeScheduleHandler.php`

```php
add_action('fluent_affiliate/creative_status_changed', function($creative, $newStatus) {
    if ($newStatus === 'active') {
        // Notify relevant affiliates the creative is now live
    }
}, 10, 2);
```

## `fluent_affiliate/after_create_creative`

Fired after a new creative asset has been saved to the database.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$creative` | `Creative` | The newly created Creative model. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_action('fluent_affiliate/after_create_creative', function($creative) {
    // Notify affiliates about the new creative
    my_plugin_notify_affiliates('New creative available: ' . $creative->name);
});
```

## `fluent_affiliate/creative_updated`

Fired after a creative asset has been updated.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$creative` | `Creative` | The updated Creative model. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_action('fluent_affiliate/creative_updated', function($creative) {
    // Flush any CDN cache for the updated creative
    my_cdn_purge_url($creative->image);
});
```

## `fluent_affiliate/before_delete_creative`

Fired immediately before a creative asset is permanently deleted.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$creative` | `Creative` | The Creative model about to be deleted. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_action('fluent_affiliate/before_delete_creative', function($creative) {
    // Archive the creative before deletion
    my_plugin_archive_creative($creative);
});
```

## `fluent_affiliate/after_delete_creative`

Fired after a creative asset has been permanently deleted.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$creativeId` | `int` | ID of the deleted creative. |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_action('fluent_affiliate/after_delete_creative', function($creativeId) {
    // Clean up any custom data tied to this creative
    delete_post_meta(0, '_fa_creative_ref_' . $creativeId);
});
```

