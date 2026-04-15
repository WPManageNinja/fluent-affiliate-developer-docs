---
title: Affiliates
description: Filter hooks in the Affiliates category.
---

# Affiliates

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/affiliate_by_param`](#fluent-affiliate-affiliate-by-param) | Filters the resolved Affiliate model when looking up an affiliate from a URL parameter. |
| [`fluent_affiliate/affiliate_widgets`](#fluent-affiliate-affiliate-widgets) | Filters the widgets displayed on the affiliate single-view page. |
| [`fluent_affiliate/affiliate_attached_coupons`](#fluent-affiliate-affiliate-attached-coupons) | Filters the coupons attached to an affiliate. |
| [`fluent_affiliate/affiliate_avatar`](#fluent-affiliate-affiliate-avatar) | See source. |

## `fluent_affiliate/affiliate_by_param`

Filters the resolved Affiliate model when looking up an affiliate from a URL parameter.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate|null` | Resolved affiliate, or `null` if not found. |
| `$paramId` | `string` | The tracking parameter value from the URL. |

**Source:** `app/Helper/Utility.php`

```php
add_filter('fluent_affiliate/affiliate_by_param', function($affiliate, $paramId) {
    // Fall back to lookup by email
    if (!$affiliate) {
        return Affiliate::where('payment_email', $paramId)->first();
    }
    return $affiliate;
}, 10, 2);
```

## `fluent_affiliate/affiliate_widgets`

Filters the widgets displayed on the affiliate single-view page.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$widgets` | `array` | Existing widget definitions. |
| `$affiliate` | `Affiliate` | The affiliate being viewed. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_filter('fluent_affiliate/affiliate_widgets', function($widgets, $affiliate) {
    $widgets[] = ['type' => 'custom_metric', 'title' => 'Custom KPI', 'value' => 42];
    return $widgets;
}, 10, 2);
```

## `fluent_affiliate/affiliate_attached_coupons`

Filters the coupons attached to an affiliate.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$coupons` | `array` | Array of coupon definitions. |
| `$affiliate` | `Affiliate` | The affiliate. |
| `$context` | `string` | Context string (e.g. `"portal"`, `"admin"`). |

**Source:** `app/Models/Affiliate.php`

```php
add_filter('fluent_affiliate/affiliate_attached_coupons', function($coupons, $affiliate, $context) {
    $coupons[] = ['code' => 'AFF' . strtoupper($affiliate->custom_param), 'discount' => '10%'];
    return $coupons;
}, 10, 3);
```

## `fluent_affiliate/affiliate_avatar`

**Source:** `app/Models/Customer.php`

