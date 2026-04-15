---
title: Referrals
description: Filter hooks in the Referrals category.
---

# Referrals

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/referral_config_field_types`](#fluent-affiliate-referral-config-field-types) | Filters the allowed field types in the referral program configuration form. |
| [`fluent_affiliate/referral_formats`](#fluent-affiliate-referral-formats) | Filters the available referral link formats (URL parameter styles). |
| [`fluent_affiliate/data_export_limit`](#fluent-affiliate-data-export-limit) | Filters the maximum number of rows returned in CSV exports. |
| [`fluent_affiliate/provider_reference_{referral}`](#fluent-affiliate-provider-reference-referral) | See source. |
| [`fluent_affiliate/provider_reference_{this}`](#fluent-affiliate-provider-reference-this) | See source. |
| [`fluent_affiliate/ignore_zero_amount_referral`](#fluent-affiliate-ignore-zero-amount-referral) | Filters whether referrals with a zero commission amount should be discarded. |
| [`fluent_affiliate/commission`](#fluent-affiliate-commission) | Filters the calculated commission amount before it is saved to a referral. |
| [`fluent_affiliate/formatted_order_data_by_{this}`](#fluent-affiliate-formatted-order-data-by-this) | See source. |
| [`fluent_affiliate/recurring_commission`](#fluent-affiliate-recurring-commission) | Filters the recurring commission data before it is recorded for a subscription renewal. |

## `fluent_affiliate/referral_config_field_types`

Filters the allowed field types in the referral program configuration form.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$fieldTypes` | `array` | Allowed field type keys. |

**Source:** `app/Helper/CustomSanitizer.php`

```php
add_filter('fluent_affiliate/referral_config_field_types', function($fieldTypes) {
    $fieldTypes[] = 'my_custom_type';
    return $fieldTypes;
});
```

## `fluent_affiliate/referral_formats`

Filters the available referral link formats (URL parameter styles).

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$formats` | `array` | Format definitions. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/referral_formats', function($formats) {
    return $formats;
});
```

## `fluent_affiliate/data_export_limit`

Filters the maximum number of rows returned in CSV exports.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$limit` | `int` | Row limit. Default `5000`. |

**Source:** `app/Http/Controllers/AffiliateController.php`

```php
add_filter('fluent_affiliate/data_export_limit', function($limit) {
    return 10000;
});
```

## `fluent_affiliate/provider_reference_{referral}`

Dynamic hook — the suffix is determined at runtime. See source for exact usage.

**Source:** `app/Http/Controllers/ReferralController.php`

## `fluent_affiliate/provider_reference_{this}`

Dynamic hook — the suffix is determined at runtime. See source for exact usage.

**Source:** `app/Models/Referral.php`

## `fluent_affiliate/ignore_zero_amount_referral`

Filters whether referrals with a zero commission amount should be discarded. Return `false` to record them.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$ignore` | `bool` | `true` to ignore, `false` to record. Defaults to `true`. |
| `$context` | `array` | Referral creation context data. |

**Source:** `app/Modules/Integrations/BaseConnector.php`

```php
add_filter('fluent_affiliate/ignore_zero_amount_referral', '__return_false');
```

## `fluent_affiliate/commission`

Filters the calculated commission amount before it is saved to a referral.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$commission` | `float` | Calculated commission amount. |
| `$context` | `array` | Contextual data: `order`, `affiliate`, `rate`, `rate_type`, etc. |

**Source:** `app/Modules/Integrations/FluentCart/Bootstrap.php`

```php
add_filter('fluent_affiliate/commission', function($commission, $context) {
    // Apply a cap of $100 per referral.
    return min($commission, 100.00);
}, 10, 2);
```

## `fluent_affiliate/formatted_order_data_by_{this}`

Dynamic hook — the suffix is determined at runtime. See source for exact usage.

**Source:** `app/Modules/Integrations/FluentCart/Bootstrap.php`

## `fluent_affiliate/recurring_commission`

Filters the recurring commission data before it is recorded for a subscription renewal.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$commissionData` | `array` | Commission data: `amount`, `rate`, `rate_type`, `renewal_count`, `max_renewal_count`. |
| `$context` | `array` | Renewal context: `order`, `affiliate`, `referral` (original). |

**Source:** `../fluent-affiliate-pro/app/Services/Integrations/FluentCart/RecurringReferral.php`

```php
add_filter('fluent_affiliate/recurring_commission', function($commissionData, $context) {
    // Reduce recurring commission by 50% after 3 renewals
    if ($commissionData['renewal_count'] > 3) {
        $commissionData['amount'] *= 0.5;
    }
    return $commissionData;
}, 10, 2);
```

