---
title: Payouts
description: Filter hooks in the Payouts category.
---

# Payouts

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/payout_form_schema`](#fluent-affiliate-payout-form-schema) | Filters the schema used to render the payout creation form in the admin. |
| [`fluent_affiliate/payout/before_create`](#fluent-affiliate-payout-before-create) | Filters the payout data array before the payout record is created. |
| [`fluent_affiliate/payout/before_processing`](#fluent-affiliate-payout-before-processing) | Filters the payout before it is processed. |

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

## `fluent_affiliate/payout/before_create`

Filters the payout data array before the payout record is created.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$payoutData` | `array` | Payout creation data. |
| `$dataConfig` | `array` | Payout configuration from the request. |
| `$affiliates` | `array` | Affiliates being included. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_filter('fluent_affiliate/payout/before_create', function($payoutData, $dataConfig, $affiliates) {
    $payoutData['title'] = 'Custom: ' . $payoutData['title'];
    return $payoutData;
}, 10, 3);
```

## `fluent_affiliate/payout/before_processing`

Filters the payout before it is processed. Return a `WP_Error` to halt processing.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$payout` | `Payout` | The Payout model. |
| `$affiliates` | `array` | Affiliates included in the payout. |
| `$dataConfig` | `array` | Payout configuration. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_filter('fluent_affiliate/payout/before_processing', function($payout, $affiliates, $dataConfig) {
    if (empty($dataConfig['method'])) {
        return new WP_Error('missing_method', 'Payout method is required.');
    }
    return $payout;
}, 10, 3);
```

