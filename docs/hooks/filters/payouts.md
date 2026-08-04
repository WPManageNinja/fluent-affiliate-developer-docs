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
| [`fluent_affiliate/payout/before_processing`](#fluent-affiliate-payout-before-processing) | Fires after the payout record is created but before referrals are processed into it. |

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

Fires after the payout record is created but before referrals are processed into it. Return a `WP_Error` to abort processing — the empty payout is deleted and the error is returned to the client.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$payout` | `Payout` | The newly created (empty) payout record. |
| `$affiliates` | `array` | Affiliates being included in the payout. |
| `$dataConfig` | `array` | Payout configuration from the request. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_filter('fluent_affiliate/payout/before_processing', function($payout, $affiliates, $dataConfig) {
    if (count($affiliates) > 500) {
        return new \WP_Error('too_many', 'Batch too large.');
    }
    return $payout;
}, 10, 3);
```

