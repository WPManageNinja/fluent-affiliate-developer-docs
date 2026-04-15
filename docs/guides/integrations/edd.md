---
title: Easy Digital Downloads Integration (Pro)
description: Track affiliate commissions from Easy Digital Downloads payments.
---

# Easy Digital Downloads Integration <span class="pro-badge">PRO</span>

The Easy Digital Downloads (EDD) integration tracks referral commissions from EDD payments.

**Detection constant:** `EDD_PLUGIN_BASE`  
**Integration key:** `edd`

## How It Works

1. Customer clicks an affiliate link → visit tracked.
2. Customer completes an EDD checkout and payment is confirmed → referral created as `unpaid`.
3. Payment is refunded / abandoned → referral rejected.

## Supported Hooks

| EDD Hook | Trigger |
|----------|---------|
| `edd_complete_purchase` | Payment completed. |
| `edd_refund_order` | Order refunded. |

## Configuration

The integration is configured under **Settings → Integrations → Easy Digital Downloads** in the FluentAffiliate admin. Available settings:

- **Commission Type** — percentage or flat rate.
- **Commission Rate** — override value.
- **Status** — enable/disable.

## Provider Reference URL

```php
add_filter('fluent_affiliate/provider_reference_edd_url', function($url, $referral) {
    return admin_url('edit.php?post_type=download&page=edd-payment-history&view=view-order-details&id=' . $referral->provider_id);
}, 10, 2);
```

## Order Data Filter

```php
add_filter('fluent_affiliate/formatted_order_data_by_edd', function($data, $payment) {
    // Add download IDs to the products field
    $data['products'] = array_map(function($item) {
        return $item['id'];
    }, $payment->cart_details ?? []);
    return $data;
}, 10, 2);
```

## Self-Referral Prevention

If the purchasing user is the same as the affiliate's WordPress user, the referral is automatically skipped.
