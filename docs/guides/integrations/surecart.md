---
title: SureCart Integration (Pro)
description: Track affiliate commissions from SureCart orders and subscriptions.
---

# SureCart Integration <span class="pro-badge">PRO</span>

The SureCart integration tracks commissions from SureCart orders and subscription renewals.

**Detection constant:** `SURECART_PLUGIN_FILE`  
**Integration key:** `surecart`

## How It Works

1. Customer clicks an affiliate link → visit tracked.
2. Customer completes a SureCart checkout → referral created as `unpaid` on payment confirmation.
3. Order is refunded → referral rejected.

## Supported Hooks

| SureCart Hook | Trigger |
|---------------|---------|
| `surecart/checkout_session_completed` | Checkout completed. |
| `surecart/refund_created` | Refund issued. |
| `surecart/subscription_renewal_invoice_paid` | Subscription renewal (recurring commissions). |

## Recurring Commissions

SureCart subscription renewals are supported when [Recurring Commissions](/guides/recurring-commissions) is enabled. Each renewal fires the standard `fluent_affiliate/referral_created` action with `type = 'recurring_sale'`.

## Configuration

Settings are under **Settings → Integrations → SureCart**.

## Custom Commission Rates

You can set a commission rate for specific SureCart products. The rates are stored in the connector config as `custom_affiliate_rates`. Each rule has `object_type`, `object_ids`, `rate_type` and `rate`.

`BaseConnector::calculateFinalCommissionAmount()` calculates the commission:

1. Each line item whose product has a custom rate earns that rate on the line's net total.
2. The rest of the order earns the affiliate's normal rate.
3. The commission is the sum of the two parts.

SureCart rules match products only. The SureCart connector passes no taxonomy, so a `category` rule never matches a SureCart order.

A bundle comes from SureCart as one parent line plus one line for each component. The integration skips the component lines, so no amount is counted twice.

## Tax-Inclusive Prices

`calculateOrderTotal()` expects a net subtotal. When a SureCart checkout has `tax_behavior = inclusive`, the subtotal and the shipping include the tax. The integration removes the tax before it calculates the commission:

- The subtotal loses `tax_inclusive_amount` minus the shipping tax.
- The shipping loses `shipping_tax_amount`.

Line items get the same treatment, so custom product rates also use net amounts.

## Provider Reference URL

```php
add_filter('fluent_affiliate/provider_reference_surecart_url', function($url, $referral) {
    // SureCart uses its own admin URL structure
    return admin_url('admin.php?page=sc-orders&id=' . $referral->provider_id);
}, 10, 2);
```

## Order Data Filter

```php
add_filter('fluent_affiliate/formatted_order_data_by_surecart', function($data, $order) {
    return $data;
}, 10, 2);
```
