---
title: Miscellaneous
description: Action hooks in the Miscellaneous category.
---

# Miscellaneous

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/loaded`](#fluent-affiliate-loaded) | Fired on `plugins_loaded` once the FluentAffiliate application container is built. |
| [`fluent_affiliate/on_wp_init`](#fluent-affiliate-on-wp-init) | Fired on WordPress `init` after FluentAffiliate has loaded. |
| [`fluent_affiliate/pro_loaded`](#fluent-affiliate-pro-loaded) | Fired after the FluentAffiliate Pro application has booted against the free plugin. |

## `fluent_affiliate/loaded`

Fired on `plugins_loaded` once the FluentAffiliate application container is built. This is the canonical attach point for add-ons — the Pro plugin boots its own application from here.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$app` | `Application` | The FluentAffiliate application (service container) instance. |

**Source:** `boot/app.php`

```php
add_action('fluent_affiliate/loaded', function($app) {
    // Register your own routes, models or handlers against the container.
    $app->addAction('fluent_affiliate/affiliate_created', function($affiliate) {
        // ...
    });
});
```

## `fluent_affiliate/on_wp_init`

Fired on WordPress `init` after FluentAffiliate has loaded. Use it for work that needs the full WordPress environment (post types, rewrite rules, translations) rather than just the plugin container.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$app` | `Application` | The FluentAffiliate application instance. |

**Source:** `boot/app.php`

```php
add_action('fluent_affiliate/on_wp_init', function($app) {
    // Safe to call WordPress APIs that are only ready on init.
});
```

## `fluent_affiliate/pro_loaded`

Fired after the FluentAffiliate Pro application has booted against the free plugin. Use this instead of `fluent_affiliate/loaded` when your code depends on Pro services, models or routes.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$app` | `Application` | The FluentAffiliate application instance shared by both plugins. |

**Source:** `../fluent-affiliate-pro/boot/app.php`

```php
add_action('fluent_affiliate/pro_loaded', function($app) {
    // Pro classes (Creative, AffiliateGroup, …) are available here.
});
```

