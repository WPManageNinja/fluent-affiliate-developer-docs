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
| [`fluent_affiliate/affiliate_customers_query`](#fluent-affiliate-affiliate-customers-query) | Filters the customer query for an affiliate before pagination. |
| [`fluent_affiliate/affiliate_customers_response`](#fluent-affiliate-affiliate-customers-response) | Filters the customers response payload for an affiliate. |
| [`fluent_affiliate/affiliate_attached_coupons`](#fluent-affiliate-affiliate-attached-coupons) | Filters the coupons attached to an affiliate. |
| [`fluent_affiliate/affiliate_avatar`](#fluent-affiliate-affiliate-avatar) | See source. |
| [`fluent_affiliate/checkout_affiliate`](#fluent-affiliate-checkout-affiliate) | Filters the affiliate resolved at checkout for an order. |

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

## `fluent_affiliate/affiliate_customers_query`

Filters the customer query for an affiliate before pagination. Pro uses this to narrow results by lifetime status (active/expired).

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$query` | `Builder` | The customers query, scoped to the affiliate. |
| `$request` | `Request` | The current request. |
| `$affiliateId` | `int` | The affiliate ID. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_filter('fluent_affiliate/affiliate_customers_query', function($query, $request, $affiliateId) {
    return $query->where('status', 'active');
}, 10, 3);
```

## `fluent_affiliate/affiliate_customers_response`

Filters the customers response payload for an affiliate. Pro appends group-aware `lifetime_expiry_days` for the expiry display.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$response` | `array` | Response payload (contains the paginated `customers`). |
| `$affiliate` | `Affiliate` | The affiliate being viewed. |
| `$request` | `Request` | The current request. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_filter('fluent_affiliate/affiliate_customers_response', function($response, $affiliate, $request) {
    $response['meta'] = ['lifetime' => true];
    return $response;
}, 10, 3);
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

## `fluent_affiliate/checkout_affiliate`

Filters the affiliate resolved at checkout for an order. Pro's lifetime commission feature uses this to attribute an order to the affiliate who originally referred the customer.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$affiliate` | `Affiliate|null` | The affiliate resolved from the tracking cookie, or `null`. |
| `$customerData` | `array` | Customer data for the order (email, name, etc.). |
| `$provider` | `string` | The integration provider key (e.g. `woo`, `edd`). |

**Source:** `app/Modules/Integrations/BaseConnector.php`

```php
add_filter('fluent_affiliate/checkout_affiliate', function($affiliate, $customerData, $provider) {
    return $affiliate;
}, 10, 3);
```

