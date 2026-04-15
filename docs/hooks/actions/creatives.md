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

Fired when a creative's status transitions (e.g. scheduled → active, active → expired). Triggered by the Action Scheduler jobs. Read `$creative->status` to determine the new status.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$creative` | `Creative` | The Creative model with its already-updated status field. |

**Source:** `../fluent-affiliate-pro/app/Hooks/Handlers/CreativeScheduleHandler.php`

```php
add_action('fluent_affiliate/creative_status_changed', function($creative) {
    if ($creative->status === 'active') {
        // Notify relevant affiliates the creative is now live
    }
});
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
| `$creative` | `Creative` | The updated Creative model (new state). |
| `$oldCreative` | `Creative` | The Creative model before the update (old state). |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_action('fluent_affiliate/creative_updated', function($creative, $oldCreative) {
    // Flush CDN cache only when the image URL changed
    if ($creative->image !== $oldCreative->image) {
        my_cdn_purge_url($oldCreative->image);
    }
}, 10, 2);
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
| `$creative` | `Creative` | The Creative model that was deleted (read-only at this point). |

**Source:** `../fluent-affiliate-pro/app/Http/Controllers/CreativeController.php`

```php
add_action('fluent_affiliate/after_delete_creative', function($creative) {
    // Clean up any custom data tied to this creative
    delete_post_meta(0, '_fa_creative_ref_' . $creative->id);
});
```

