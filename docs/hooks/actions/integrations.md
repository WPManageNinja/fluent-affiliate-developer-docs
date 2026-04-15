---
title: Integrations
description: Action hooks in the Integrations category.
---

# Integrations

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/wipe_current_data`](#fluent-affiliate-wipe-current-data) | Fired when an admin triggers a full data-wipe via the migration tools. |
| [`fluent_affiliate/affiliate_created_via_fluent_form`](#fluent-affiliate-affiliate-created-via-fluent-form) | Fired when a new affiliate is created through a Fluent Forms registration feed. |

## `fluent_affiliate/wipe_current_data`

Fired when an admin triggers a full data-wipe via the migration tools.

**Source:** `app/Http/Controllers/MigrationController.php`

```php
add_action('fluent_affiliate/wipe_current_data', function() {
    // Remove plugin data that is not in FA tables.
    delete_option('my_plugin_affiliate_cache');
});
```

## `fluent_affiliate/affiliate_created_via_fluent_form`

Fired when a new affiliate is created through a Fluent Forms registration feed.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate` | The new Affiliate model. |
| `$user` | `WP_User` | The WordPress user linked to the affiliate. |
| `$feedData` | `array` | The Fluent Forms feed data that triggered the creation. |

**Source:** `app/Modules/Integrations/FluentForms/FluentFormAffiliateRegistration.php`

```php
add_action('fluent_affiliate/affiliate_created_via_fluent_form', function($affiliate, $user, $feedData) {
    // Integration-specific post-processing
}, 10, 3);
```

