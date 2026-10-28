---
title: Integrations
description: Filter hooks in the Integrations category.
---

# Integrations

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/get_integrations`](#fluent-affiliate-get-integrations) | Filters the array of registered integration definitions shown in Settings → Integrations. |
| [`fluent_affiliate/get_integration_config_{integration}`](#fluent-affiliate-get-integration-config-integration) | Filters the configuration data for a specific integration. |
| [`fluent_affiliate/save_integration_config_{integration}`](#fluent-affiliate-save-integration-config-integration) | Filters the result of saving an integration's configuration. |
| [`fluent_affiliate/get_integration_stored_config_{integration}`](#fluent-affiliate-get-integration-stored-config-integration) | Filters an integration's stored connector config as it is read from the `_{integration}_connector_config` option. |
| [`fluent_affiliate/get_product_cat_options_{integration}`](#fluent-affiliate-get-product-cat-options-integration) | Dynamic filter for populating the product/category options list in an integration settings form. |
| [`fluent_affiliate/migrators`](#fluent-affiliate-migrators) | Filters the list of available data migrators in the Migration Tools. |
| [`fluent_affiliate/get_migration_statistics`](#fluent-affiliate-get-migration-statistics) | Filters migration statistics shown in the admin migration tools. |
| [`fluent_affiliate/get_current_data_counts`](#fluent-affiliate-get-current-data-counts) | Filters the current data counts displayed before a wipe operation. |
| [`fluent_affiliate/wppayform__defaults`](#fluent-affiliate-wppayform-defaults) | Filters the default field values pre-filled into a Paymattic affiliate registration form. |
| [`fluent_affiliate/visit_flood_limit`](#fluent-affiliate-visit-flood-limit) | Filters how many visits one IP address can record in one hour. |
| [`fluent_affiliate/visit_dedup_window`](#fluent-affiliate-visit-dedup-window) | Filters the time window, in seconds, in which a repeat visit from the same IP address for the same affiliate is not recorded again. |
| [`fluent_affiliate/user_ip`](#fluent-affiliate-user-ip) | Filters the visitor IP address used for visit tracking. |
| [`fluent_affiliate/trust_proxy_headers`](#fluent-affiliate-trust-proxy-headers) | Controls whether visit tracking trusts the `X-Forwarded-For` header from the proxies listed in `fluent_affiliate/trusted_proxies` when resolving the visitor IP. |
| [`fluent_affiliate/trusted_proxies`](#fluent-affiliate-trusted-proxies) | Filters the proxy IP addresses whose `X-Forwarded-For` header is trusted when the visitor IP is resolved. |
| [`fluent_affiliate/md_ingest_limit`](#fluent-affiliate-md-ingest-limit) | Filters how many visit rows one connected site can send to the multi-domain tracking endpoint in one minute <span class="pro-badge">PRO</span>. |
| [`fluent_affiliate/woo_menu_link_position`](#fluent-affiliate-woo-menu-link-position) | Filters the menu position integer for the FluentAffiliate link added to the WooCommerce My Account menu. |
| [`fluent_affiliate/woo_menu_label`](#fluent-affiliate-woo-menu-label) | Filters the label text for the FluentAffiliate link in the WooCommerce My Account menu. |

## `fluent_affiliate/get_integrations`

Filters the array of registered integration definitions shown in Settings → Integrations.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$integrations` | `array` | Existing integration definitions keyed by slug. |

**Source:** `app/Hooks/Handlers/AdminMenuHandler.php`

```php
add_filter('fluent_affiliate/get_integrations', function($integrations) {
    $integrations['my_plugin'] = [
        'title' => 'My Plugin',
        'slug'  => 'my_plugin',
        'logo'  => MY_PLUGIN_URL . 'logo.svg',
    ];
    return $integrations;
});
```

## `fluent_affiliate/get_integration_config_{integration}`

Filters the configuration data for a specific integration. The hook suffix is the integration slug.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$config` | `array` | Saved configuration for the integration. |

**Source:** `app/Http/Controllers/IntegrationController.php`

```php
add_filter('fluent_affiliate/get_integration_config_my_plugin', function($config) {
    $config['api_key'] = get_option('my_plugin_api_key', '');
    return $config;
});
```

## `fluent_affiliate/save_integration_config_{integration}`

Filters the result of saving an integration's configuration. Return a non-empty string to show as an error.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$message` | `string` | Error message (empty string = success). |
| `$config` | `array` | The configuration data being saved. |

**Source:** `app/Http/Controllers/IntegrationController.php`

```php
add_filter('fluent_affiliate/save_integration_config_my_plugin', function($message, $config) {
    update_option('my_plugin_api_key', sanitize_text_field($config['api_key'] ?? ''));
    return ''; // return empty string = success
}, 10, 2);
```

## `fluent_affiliate/get_integration_stored_config_{integration}`

Filters an integration's stored connector config as it is read from the `_{integration}_connector_config` option. The `{integration}` segment is the integration key (e.g. `woo`, `fluent_cart`). `BaseConnectorSettings` uses this hook to merge each integration's defaults into the saved config.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$config` | `array` | Stored connector configuration for this integration. |

**Source:** `app/Http/Controllers/IntegrationController.php`

```php
add_filter('fluent_affiliate/get_integration_stored_config_woo', function($config) {
    $config['commission_type'] = $config['commission_type'] ?? 'percentage';
    return $config;
});
```

## `fluent_affiliate/get_product_cat_options_{integration}`

Dynamic filter for populating the product/category options list in an integration settings form. The `{integration}` segment is the integration slug (e.g. `woo`, `edd`). Return an array of `{ id, name }` objects.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$options` | `array` | Array of option objects, each with `id` (int) and `name` (string). |

**Source:** `app/Http/Controllers/IntegrationController.php`

```php
// Example: add a custom option to the WooCommerce product category list
add_filter('fluent_affiliate/get_product_cat_options_woo', function($options) {
    $options[] = ['id' => 999, 'name' => 'My Custom Category'];
    return $options;
});
```

## `fluent_affiliate/migrators`

Filters the list of available data migrators in the Migration Tools.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$migrators` | `array` | Migrator class definitions keyed by slug. |

**Source:** `app/Http/Controllers/MigrationController.php`

```php
add_filter('fluent_affiliate/migrators', function($migrators) {
    $migrators['my_plugin'] = ['title' => 'My Plugin Importer', 'class' => MyMigrator::class];
    return $migrators;
});
```

## `fluent_affiliate/get_migration_statistics`

Filters migration statistics shown in the admin migration tools.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$stats` | `array` | Statistics array. |

**Source:** `app/Http/Controllers/MigrationController.php`

```php
add_filter('fluent_affiliate/get_migration_statistics', function($stats) {
    $stats['my_plugin'] = MyMigrator::getStats();
    return $stats;
});
```

## `fluent_affiliate/get_current_data_counts`

Filters the current data counts displayed before a wipe operation.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$counts` | `array` | Label => count pairs. |

**Source:** `app/Http/Controllers/MigrationController.php`

```php
add_filter('fluent_affiliate/get_current_data_counts', function($counts) {
    return $counts;
});
```

## `fluent_affiliate/wppayform__defaults`

Filters the default field values pre-filled into a Paymattic affiliate registration form.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$fields` | `array` | Form field defaults. |
| `$formId` | `int` | Paymattic form ID. |

**Source:** `app/Modules/Integrations/Paymattic/BootstrapAffiliateRegister.php`

```php
add_filter('fluent_affiliate/wppayform__defaults', function($fields, $formId) {
    return $fields;
}, 10, 2);
```

## `fluent_affiliate/visit_flood_limit`

Filters how many visits one IP address can record in one hour. When an IP reaches the limit, more visits from it are not recorded. Return `0` or less to turn off the limit.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$limit` | `int` | Maximum visits per IP per hour. Default `100`. |

**Source:** `app/Services/VisitService.php`

```php
add_filter('fluent_affiliate/visit_flood_limit', function($limit) {
    return 500; // busy shared IPs, e.g. office NAT
});
```

## `fluent_affiliate/visit_dedup_window`

Filters the time window, in seconds, in which a repeat visit from the same IP address for the same affiliate is not recorded again. Return `0` to record every visit.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$seconds` | `int` | Window length in seconds. Default `1800` (30 minutes). |

**Source:** `app/Services/VisitService.php`

```php
add_filter('fluent_affiliate/visit_dedup_window', function($seconds) {
    return HOUR_IN_SECONDS;
});
```

## `fluent_affiliate/user_ip`

Filters the visitor IP address used for visit tracking.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$ip` | `string` | Detected IP address. |

**Source:** `app/Services/VisitService.php`

```php
add_filter('fluent_affiliate/user_ip', function($ip) {
    // Return anonymised IP for GDPR compliance
    $parts = explode('.', $ip);
    $parts[3] = '0';
    return implode('.', $parts);
});
```

## `fluent_affiliate/trust_proxy_headers`

Controls whether visit tracking trusts the `X-Forwarded-For` header from the proxies listed in `fluent_affiliate/trusted_proxies` when resolving the visitor IP. Return `false` on sites that are not behind a trusted proxy. `CF-Connecting-IP` is not affected: it is used only when `REMOTE_ADDR` is a Cloudflare IP.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$trust` | `bool` | Whether proxy headers are trusted. Default `true`. |

**Source:** `app/Services/VisitService.php`

```php
add_filter('fluent_affiliate/trust_proxy_headers', '__return_false');
```

## `fluent_affiliate/trusted_proxies`

Filters the proxy IP addresses whose `X-Forwarded-For` header is trusted when the visitor IP is resolved. For a trusted proxy, the right-most hop is used, because only that hop is written by the proxy. A request from any other `REMOTE_ADDR` uses `REMOTE_ADDR` as is. Has no effect when `fluent_affiliate/trust_proxy_headers` returns `false`.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$proxies` | `array` | Trusted proxy IPs. Default `['127.0.0.1']`. |

**Source:** `app/Services/VisitService.php`

```php
add_filter('fluent_affiliate/trusted_proxies', function($proxies) {
    $proxies[] = '10.0.0.5'; // your load balancer
    return $proxies;
});
```

## `fluent_affiliate/md_ingest_limit`

Filters how many visit rows one connected site can send to the multi-domain tracking endpoint in one minute <span class="pro-badge">PRO</span>. Requests above the limit get HTTP `429`.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$limit` | `int` | Maximum rows per connected site per minute. Default `300`. |

**Source:** `../fluent-affiliate-pro/app/Hooks/Handlers/MultiDomainTranckerHandler.php`

```php
add_filter('fluent_affiliate/md_ingest_limit', function($limit) {
    return 1000;
});
```

## `fluent_affiliate/woo_menu_link_position`

Filters the menu position integer for the FluentAffiliate link added to the WooCommerce My Account menu.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$position` | `int` | Menu priority/position. Lower = earlier in the list. |

**Source:** `../fluent-affiliate-pro/app/Services/Integrations/WooCommerce/Bootstrap.php`

```php
add_filter('fluent_affiliate/woo_menu_link_position', function($position) {
    return 5; // Move to top of account menu
});
```

## `fluent_affiliate/woo_menu_label`

Filters the label text for the FluentAffiliate link in the WooCommerce My Account menu.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$label` | `string` | The menu item label. Defaults to `'Affiliate Dashboard'`. |

**Source:** `../fluent-affiliate-pro/app/Services/Integrations/WooCommerce/Bootstrap.php`

```php
add_filter('fluent_affiliate/woo_menu_label', function($label) {
    return __('My Referrals', 'my-plugin');
});
```

