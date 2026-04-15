---
title: Portal
description: Filter hooks in the Portal category.
---

# Portal

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/portal_menu_items`](#fluent-affiliate-portal-menu-items) | Filters the navigation items shown in the affiliate portal sidebar. |
| [`fluent_affiliate/portal_page_url`](#fluent-affiliate-portal-page-url) | Filters the URL of the affiliate portal page. |
| [`fluent_affiliate/default_share_url`](#fluent-affiliate-default-share-url) | Filters the default share URL used in affiliate tracking links when no specific page is configured. |
| [`fluent_affiliate/portal_notice_html`](#fluent-affiliate-portal-notice-html) | Filters the HTML notice shown at the top of the affiliate portal. |
| [`fluent_affiliate/will_load_tracker_js`](#fluent-affiliate-will-load-tracker-js) | Filters whether the affiliate tracking JavaScript is enqueued on the front end. |
| [`fluent_affiliate/portal/pending_message`](#fluent-affiliate-portal-pending-message) | Filters the HTML shown to an affiliate whose account is pending approval. |
| [`fluent_affiliate/portal/inactive_message`](#fluent-affiliate-portal-inactive-message) | Filters the HTML shown to an affiliate whose account is inactive. |
| [`fluent_affiliate/portal/additional_sites`](#fluent-affiliate-portal-additional-sites) | Filters the list of additional sites shown in the affiliate portal share widget (Pro connected-sites feature). |
| [`fluent_affiliate/portal_localize_data`](#fluent-affiliate-portal-localize-data) | Filters all JavaScript data passed to the affiliate portal SPA. |
| [`fluent_affiliate/smartcode_fallback`](#fluent-affiliate-smartcode-fallback) | Filters the fallback output when a smart code is unrecognised. |
| [`fluent_affiliate/smartcode_group_callback_{dataKey}`](#fluent-affiliate-smartcode-group-callback-datakey) | Fires for an unrecognised smart code group, allowing third-party data keys. |

## `fluent_affiliate/portal_menu_items`

Filters the navigation items shown in the affiliate portal sidebar.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$items` | `array` | Portal menu items. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/portal_menu_items', function($items) {
    $items[] = ['title' => 'My Custom Page', 'route' => 'custom-page', 'icon' => 'el-icon-document'];
    return $items;
});
```

## `fluent_affiliate/portal_page_url`

Filters the URL of the affiliate portal page.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | The portal page URL. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/portal_page_url', function($url) {
    return home_url('/affiliates/dashboard/');
});
```

## `fluent_affiliate/default_share_url`

Filters the default share URL used in affiliate tracking links when no specific page is configured.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | The current share URL (defaults to `home_url('/')`). |
| `$affiliate` | `Affiliate` | The Affiliate model. |

**Source:** `app/Hooks/Handlers/BlockEditorHandler.php`

```php
add_filter('fluent_affiliate/default_share_url', function($url, $affiliate) {
    return home_url('/shop/');
}, 10, 2);
```

## `fluent_affiliate/portal_notice_html`

Filters the HTML notice shown at the top of the affiliate portal.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$html` | `string` | Notice HTML, empty by default. |

**Source:** `app/Http/Controllers/Portal/PortalController.php`

```php
add_filter('fluent_affiliate/portal_notice_html', function($html) {
    return '<div class="notice notice-info">Special promotion this month!</div>';
});
```

## `fluent_affiliate/will_load_tracker_js`

Filters whether the affiliate tracking JavaScript is enqueued on the front end.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$willLoad` | `bool` | `true` to load (default), `false` to suppress. |

**Source:** `app/Modules/Integrations/FluentBooking/Bootstrap.php`

```php
// Disable tracker on specific pages
add_filter('fluent_affiliate/will_load_tracker_js', function($willLoad) {
    if (is_page('checkout')) {
        return false;
    }
    return $willLoad;
});
```

## `fluent_affiliate/portal/pending_message`

Filters the HTML shown to an affiliate whose account is pending approval.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$html` | `string` | The pending message HTML. |
| `$affiliate` | `Affiliate` | The affiliate viewing the portal. |

**Source:** `app/Modules/Portal/CustomerPortal.php`

```php
add_filter('fluent_affiliate/portal/pending_message', function($html, $affiliate) {
    return '<p>Your application is under review. We will email you within 24 hours.</p>';
}, 10, 2);
```

## `fluent_affiliate/portal/inactive_message`

Filters the HTML shown to an affiliate whose account is inactive.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$html` | `string` | The inactive message HTML. |
| `$affiliate` | `Affiliate` | The affiliate viewing the portal. |

**Source:** `app/Modules/Portal/CustomerPortal.php`

```php
add_filter('fluent_affiliate/portal/inactive_message', function($html, $affiliate) {
    return '<p>Your account has been deactivated. Please contact support.</p>';
}, 10, 2);
```

## `fluent_affiliate/portal/additional_sites`

Filters the list of additional sites shown in the affiliate portal share widget (Pro connected-sites feature).

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$sites` | `array` | Array of site definitions. Each entry: `['name', 'url', 'param']`. |

**Source:** `app/Modules/Portal/CustomerPortal.php`

```php
add_filter('fluent_affiliate/portal/additional_sites', function($sites) {
    $sites[] = ['name' => 'My Store', 'url' => 'https://mystore.com/', 'param' => 'ref'];
    return $sites;
});
```

## `fluent_affiliate/portal_localize_data`

Filters all JavaScript data passed to the affiliate portal SPA.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$portalData` | `array` | Associative array of JS variables. |

**Source:** `app/Modules/Portal/CustomerPortal.php`

```php
add_filter('fluent_affiliate/portal_localize_data', function($portalData) {
    $portalData['custom_setting'] = get_option('my_plugin_portal_setting');
    return $portalData;
});
```

## `fluent_affiliate/smartcode_fallback`

Filters the fallback output when a smart code is unrecognised.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$original` | `string` | Original unmatched smart code string. |
| `$data` | `array` | Context data passed to the parser. |

**Source:** `app/Services/Libs/SmartCodeParser.php`

```php
add_filter('fluent_affiliate/smartcode_fallback', function($original, $data) {
    return ''; // Remove unrecognised codes instead of leaving them visible.
}, 10, 2);
```

## `fluent_affiliate/smartcode_group_callback_{dataKey}`

Fires for an unrecognised smart code group, allowing third-party data keys. The hook suffix is the group key from the template.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$original` | `string` | Original matched string. |
| `$valueKey` | `string` | The specific sub-key requested. |
| `$defaultValue` | `mixed` | Default value if unresolved. |
| `$data` | `array` | Context data. |

**Source:** `app/Services/Libs/SmartCodeParser.php`

```php
add_filter('fluent_affiliate/smartcode_group_callback_order', function($original, $valueKey, $default, $data) {
    if ($valueKey === 'number') {
        return $data['order']['number'] ?? $default;
    }
    return $original;
}, 10, 4);
```

