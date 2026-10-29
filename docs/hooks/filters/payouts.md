---
title: Payouts
description: Filter hooks in the Payouts category.
---

# Payouts

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/payout_methods`](#fluent-affiliate-payout-methods) | Registers the payout methods an admin can select when creating a payout, keyed by slug. |
| [`fluent_affiliate/payout_form_schema`](#fluent-affiliate-payout-form-schema) | Filters the schema used to render the payout creation form in the admin. |
| [`fluent_affiliate/payout/details`](#fluent-affiliate-payout-details) | Filters the payout returned by `GET /payouts/{id}`. |
| [`fluent_affiliate/payout/validated_config`](#fluent-affiliate-payout-validated-config) | Filters the validated payout configuration. |
| [`fluent_affiliate/payout/before_create`](#fluent-affiliate-payout-before-create) | Filters the payout data array before the payout record is created. |
| [`fluent_affiliate/payout/before_processing`](#fluent-affiliate-payout-before-processing) | Fires after the payout record is created but before referrals are processed into it. |

## `fluent_affiliate/payout_methods`

Registers the payout methods an admin can select when creating a payout, keyed by slug. `manual` is always present, even if a callback removes it. Any other key is a gateway method: its payouts keep their referrals and transactions in `processing` until the gateway settles them. Pro adds `paypal_payouts` here when the referral setting `payout_method` is `paypal` and the PayPal keys for the active mode are saved. An unknown method on a payout falls back to `manual`.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$methods` | `array` | Method labels keyed by slug. Default `['manual' => 'Manual']`. |

**Source:** `app/Helper/Helper.php`

```php
add_filter('fluent_affiliate/payout_methods', function($methods) {
    $methods['wise'] = __('Wise', 'my-plugin');
    return $methods;
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

## `fluent_affiliate/payout/details`

Filters the payout returned by `GET /payouts/{id}`. A payout gateway uses it to add state that only the server can decide, such as which actions the admin can take next. Pro adds `paypal_can_send_again` to PayPal payouts.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$payout` | `Payout` | The Payout model, with `creator`, `referrals_count`, `transactions_count`, `processing_count` and `processing_amount` set. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_filter('fluent_affiliate/payout/details', function($payout) {
    if (($payout->settings['payout_method'] ?? '') === 'wise') {
        $payout->wise_batch_url = 'https://wise.com/...';
    }
    return $payout;
});
```

## `fluent_affiliate/payout/validated_config`

Filters the validated payout configuration. The same filter serves the review preview (`POST /payouts/validate-payout-config`) and `POST /payouts/process-payout`, so a gateway can remove affiliates it cannot pay from both. Pro uses it to skip PayPal payees without a valid payment email and reports them under `skipped`.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$validated` | `array` | `payable_affiliates` (Collection), `payable_total_amount` (float), `held`, and `config` (`start_date`, `end_date`, `min_payout`, `affiliate_ids`, `payout_method`, `ignore_holding_period`). |
| `$config` | `array` | The raw payout config from the request. |

**Source:** `app/Http/Controllers/PayoutController.php`

```php
add_filter('fluent_affiliate/payout/validated_config', function($validated, $config) {
    if ($validated['config']['payout_method'] !== 'wise') {
        return $validated;
    }

    $payable = $validated['payable_affiliates']->filter(function($affiliate) {
        return !empty($affiliate->settings['wise_email']);
    })->values();

    $validated['payable_affiliates']   = $payable->isEmpty() ? [] : $payable;
    $validated['payable_total_amount'] = $payable->sum('total_payable_amount');

    return $validated;
}, 10, 2);
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

