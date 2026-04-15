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
