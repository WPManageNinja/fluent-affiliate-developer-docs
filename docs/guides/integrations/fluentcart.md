---
title: FluentCart Integration (Core)
description: Track affiliate commissions from FluentCart orders. Built into FluentAffiliate core.
---

# FluentCart Integration

The FluentCart integration is bundled with **FluentAffiliate core** (not Pro only).

**Detection constant:** `FLUENTCART_VERSION`  
**Integration key:** `fluentcart`

## How It Works

1. Customer clicks an affiliate link → visit tracked.
2. Customer completes a FluentCart checkout → referral created as `unpaid`.
3. Order is refunded or cancelled → referral rejected.

## Supported Hooks

| FluentCart Hook | Trigger |
|-----------------|---------|
| `fluentcart/order_paid` | Order payment completed. |
| `fluentcart/order_refunded` | Order refunded. |
| `fluentcart/subscription_renewal_paid` | Subscription renewal (recurring commissions). |

## Recurring Commissions

FluentCart recurring payments are supported when [Recurring Commissions](/guides/recurring-commissions) is enabled.

## Filter Hooks

### `fluent_affiliate/formatted_order_data_by_fluentcart`

```php
add_filter('fluent_affiliate/formatted_order_data_by_fluentcart', function($data, $order) {
    // Attach UTM campaign from FluentCart order meta
    $data['utm_campaign'] = $order->getMeta('utm_campaign');
    return $data;
}, 10, 2);
```

## Provider Reference URL

```php
add_filter('fluent_affiliate/provider_reference_fluentcart_url', function($url, $referral) {
    return admin_url('admin.php?page=fluent-cart#/orders/' . $referral->provider_id);
}, 10, 2);
```
