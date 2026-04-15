---
title: Settings
description: Filter hooks in the Settings category.
---

# Settings

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/get_currencies`](#fluent-affiliate-get-currencies) | Filters the list of available currencies. |
| [`fluent_affiliate/currency_symbols`](#fluent-affiliate-currency-symbols) | Filters the currency symbol lookup table. |
| [`fluent_affiliate/suggested_colors`](#fluent-affiliate-suggested-colors) | Filters the colour palette suggested in affiliate creative settings. |
| [`fluent_affiliate/payout_form_schema`](#fluent-affiliate-payout-form-schema) | Filters the schema used to render the payout creation form in the admin. |
| [`fluent_affiliate/default_referral_settings`](#fluent-affiliate-default-referral-settings) | Filters the default referral settings used when no custom configuration is saved. |
| [`fluent_affiliate/admin_url`](#fluent-affiliate-admin-url) | Filters the FluentAffiliate admin URL. |
| [`fluent_affiliate/registered_features`](#fluent-affiliate-registered-features) | Filters the list of feature modules registered with FluentAffiliate. |
| [`fluent_affiliate/max_execution_time`](#fluent-affiliate-max-execution-time) | Filters the maximum execution time (seconds) for long-running background jobs. |
| [`fluent_affiliate/is_rtl`](#fluent-affiliate-is-rtl) | Filters whether RTL (right-to-left) mode is active for the affiliate portal. |
| [`fluent_affiliate/top_menu_items`](#fluent-affiliate-top-menu-items) | Filters the top navigation items in the FluentAffiliate admin. |
| [`fluent_affiliate/right_menu_items`](#fluent-affiliate-right-menu-items) | Filters the right-side navigation items in the admin header. |
| [`fluent_affiliate/admin_vars`](#fluent-affiliate-admin-vars) | Filters the JavaScript variables object passed to the admin SPA. |
| [`fluent_affiliate/dashboard_notices`](#fluent-affiliate-dashboard-notices) | Filters the notices array displayed at the top of the FluentAffiliate dashboard. |
| [`fluent_affiliate/settings_menu_items`](#fluent-affiliate-settings-menu-items) | Filters the settings sub-menu items shown in the admin sidebar. |
| [`fluent_affiliate/get_email_config`](#fluent-affiliate-get-email-config) | Filters the global email notification configuration before it is returned to the admin. |
| [`fluent_affiliate/update_email_config`](#fluent-affiliate-update-email-config) | Filters the email configuration before it is persisted after an admin save. |
| [`fluent_affiliate/get_referral_config`](#fluent-affiliate-get-referral-config) | Filters the referral program configuration before it is returned to the admin. |
| [`fluent_affiliate/update_referral_config`](#fluent-affiliate-update-referral-config) | Filters the referral configuration before it is saved. |
| [`fluent_affiliate/get_feature_settings_{featureKey}`](#fluent-affiliate-get-feature-settings-featurekey) | Filters the settings returned for a specific feature. |
| [`fluent_affiliate/update_feature_settings_{featureKey}`](#fluent-affiliate-update-feature-settings-featurekey) | See source. |
| [`fluent_affiliate/update_feature_response_{featureKey}`](#fluent-affiliate-update-feature-response-featurekey) | Filters the response after a feature's settings are updated. |
| [`fluent_affiliate/social_media_links`](#fluent-affiliate-social-media-links) | Filters the array of social media platform definitions shown in the affiliate portal share widget. |
| [`fluent_affiliate/social_media_share_default_enabled_keys`](#fluent-affiliate-social-media-share-default-enabled-keys) | Filters the list of social platform keys that are enabled by default (when no custom configuration has been saved). |

## `fluent_affiliate/get_currencies`

Filters the list of available currencies.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$currencies` | `array` | Array of currency code => label pairs. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/get_currencies', function($currencies) {
    $currencies['XBT'] = 'Bitcoin';
    return $currencies;
});
```

## `fluent_affiliate/currency_symbols`

Filters the currency symbol lookup table.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$symbols` | `array` | Array of currency code => symbol pairs. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/currency_symbols', function($symbols) {
    $symbols['XBT'] = '₿';
    return $symbols;
});
```

## `fluent_affiliate/suggested_colors`

Filters the colour palette suggested in affiliate creative settings.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$colors` | `array` | Array of hex colour strings. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/suggested_colors', function($colors) {
    $colors[] = '#ff5722';
    return $colors;
});
```

## `fluent_affiliate/payout_form_schema`

Filters the schema used to render the payout creation form in the admin.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$schema` | `array` | Form field schema. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/payout_form_schema', function($schema) {
    return $schema;
});
```

## `fluent_affiliate/default_referral_settings`

Filters the default referral settings used when no custom configuration is saved.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$settings` | `array` | Default settings array. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/default_referral_settings', function($settings) {
    $settings['cookie_expiry'] = 90;
    return $settings;
});
```

## `fluent_affiliate/admin_url`

Filters the FluentAffiliate admin URL.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | Admin URL. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/admin_url', function($url) {
    return $url;
});
```

## `fluent_affiliate/registered_features`

Filters the list of feature modules registered with FluentAffiliate.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$features` | `array` | Registered feature definitions. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/registered_features', function($features) {
    $features['my_feature'] = ['title' => 'My Feature', 'enabled' => true];
    return $features;
});
```

## `fluent_affiliate/max_execution_time`

Filters the maximum execution time (seconds) for long-running background jobs.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$seconds` | `int` | Max execution seconds. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/max_execution_time', function($seconds) {
    return 120;
});
```

## `fluent_affiliate/is_rtl`

Filters whether RTL (right-to-left) mode is active for the affiliate portal.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$isRtl` | `bool` | `true` for RTL, `false` for LTR. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/is_rtl', '__return_false');
```

## `fluent_affiliate/top_menu_items`

Filters the top navigation items in the FluentAffiliate admin.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$items` | `array` | Navigation item definitions. |

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_filter('fluent_affiliate/top_menu_items', function($items) {
    $items[] = ['title' => 'My Page', 'route' => '/my-page', 'icon' => 'el-icon-star-on'];
    return $items;
});
```

## `fluent_affiliate/right_menu_items`

Filters the right-side navigation items in the admin header.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$items` | `array` | Right-side navigation items. |

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_filter('fluent_affiliate/right_menu_items', function($items) {
    return $items;
});
```

## `fluent_affiliate/admin_vars`

Filters the JavaScript variables object passed to the admin SPA.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$vars` | `array` | JS variables object. |

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_filter('fluent_affiliate/admin_vars', function($vars) {
    $vars['my_plugin_key'] = get_option('my_plugin_option');
    return $vars;
});
```

## `fluent_affiliate/dashboard_notices`

Filters the notices array displayed at the top of the FluentAffiliate dashboard.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$notices` | `array` | Array of notice definitions. |

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_filter('fluent_affiliate/dashboard_notices', function($notices) {
    $notices[] = ['type' => 'info', 'message' => 'New payment gateway available!'];
    return $notices;
});
```

## `fluent_affiliate/settings_menu_items`

Filters the settings sub-menu items shown in the admin sidebar.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$items` | `array` | Menu item definitions. |

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_filter('fluent_affiliate/settings_menu_items', function($items) {
    $items[] = ['title' => 'My Setting', 'route' => '/settings/my-setting'];
    return $items;
});
```

## `fluent_affiliate/get_email_config`

Filters the global email notification configuration before it is returned to the admin.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$config` | `array` | Email configuration array. |

**Source:** `app/Http/Controllers/SettingController.php`

```php
add_filter('fluent_affiliate/get_email_config', function($config) {
    $config['from_name'] = get_bloginfo('name') . ' Affiliates';
    return $config;
});
```

## `fluent_affiliate/update_email_config`

Filters the email configuration before it is persisted after an admin save.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$config` | `array` | New configuration data being saved. |

**Source:** `app/Http/Controllers/SettingController.php`

```php
add_filter('fluent_affiliate/update_email_config', function($config) {
    // Force a specific reply-to address.
    $config['reply_to'] = 'affiliates@example.com';
    return $config;
});
```

## `fluent_affiliate/get_referral_config`

Filters the referral program configuration before it is returned to the admin.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$config` | `array` | Referral configuration array. |

**Source:** `app/Http/Controllers/SettingController.php`

```php
add_filter('fluent_affiliate/get_referral_config', function($config) {
    $config['cookie_expiry'] = 60; // 60 days
    return $config;
});
```

## `fluent_affiliate/update_referral_config`

Filters the referral configuration before it is saved.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$config` | `array` | New referral configuration. |

**Source:** `app/Http/Controllers/SettingController.php`

```php
add_filter('fluent_affiliate/update_referral_config', function($config) {
    return $config;
});
```

## `fluent_affiliate/get_feature_settings_{featureKey}`

Filters the settings returned for a specific feature. The suffix is the feature key.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$response` | `array` | Settings response data. |
| `$savedData` | `array` | Data as saved in the database. |

**Source:** `app/Http/Controllers/SettingController.php`

```php
add_filter('fluent_affiliate/get_feature_settings_my_feature', function($response, $saved) {
    $response['extra_option'] = get_option('my_extra_option', false);
    return $response;
}, 10, 2);
```

## `fluent_affiliate/update_feature_settings_{featureKey}`

Dynamic hook — the suffix is determined at runtime. See source for exact usage.

**Source:** `app/Http/Controllers/SettingController.php`

## `fluent_affiliate/update_feature_response_{featureKey}`

Filters the response after a feature's settings are updated.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$response` | `array` | Response data returned to the client. |
| `$savedData` | `array` | Data as saved. |

**Source:** `app/Http/Controllers/SettingController.php`

```php
add_filter('fluent_affiliate/update_feature_response_my_feature', function($response, $saved) {
    return $response;
}, 10, 2);
```

## `fluent_affiliate/social_media_links`

Filters the array of social media platform definitions shown in the affiliate portal share widget. Each item must have `key`, `title`, `icon`, `share_url`, and `status`.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$links` | `array` | Associative array of platform definitions keyed by slug (e.g. `twitter`, `facebook`). |

**Source:** `../fluent-affiliate-pro/app/Services/SocialMediaShareService.php`

```php
add_filter('fluent_affiliate/social_media_links', function($links) {
    // Add a custom platform
    $links['mastodon'] = [
        'key'       => 'mastodon',
        'title'     => 'Mastodon',
        'icon'      => '<svg>…</svg>',
        'share_url' => 'https://mastodon.social/share?text={title}%20{url}',
        'status'    => 'yes',
    ];
    return $links;
});
```

## `fluent_affiliate/social_media_share_default_enabled_keys`

Filters the list of social platform keys that are enabled by default (when no custom configuration has been saved). Defaults to `['facebook', 'twitter', 'linkedin', 'whatsapp', 'email']`.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$keys` | `array` | Array of platform key strings. |

**Source:** `../fluent-affiliate-pro/app/Services/SocialMediaShareService.php`

```php
add_filter('fluent_affiliate/social_media_share_default_enabled_keys', function($keys) {
    // Only enable Twitter and email by default
    return ['twitter', 'email'];
});
```

