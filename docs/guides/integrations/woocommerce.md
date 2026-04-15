---
title: WooCommerce Integration (Pro)
description: Track affiliate referrals from WooCommerce orders, map coupons to affiliates, and show the affiliate portal in the My Account menu.
---

# WooCommerce Integration <span class="pro-badge">PRO</span>

The WooCommerce integration tracks referral commissions from WooCommerce orders and subscriptions.

**Detection constant:** `WC_PLUGIN_FILE`

## How It Works

The integration hooks into WooCommerce's order lifecycle:

1. Customer clicks an affiliate link → visit is tracked.
2. Customer completes a WooCommerce checkout → `woocommerce_checkout_order_processed` fires.
3. Order payment is confirmed → commission is recorded as an `unpaid` referral.
4. If the order is refunded → referral is rejected and earnings reversed.

### Supported Order Hooks

| WordPress Hook | Trigger |
|---------------|---------|
| `woocommerce_store_api_checkout_order_processed` | Block-based checkout. |
| `woocommerce_checkout_order_processed` | Classic checkout. |
| `woocommerce_order_status_changed` | Status transitions (completed, refunded, cancelled). |

## Integration Key

```php
$integrationKey = 'woo'; // used in provider field on referrals
```

## Coupon → Affiliate Mapping

You can link a WooCommerce coupon to an affiliate. When a customer uses that coupon, the mapped affiliate gets credit — **even if the customer didn't click an affiliate link**.

To map a coupon, save `_fa_affiliate_id` post meta on the coupon post:

```php
// Link coupon ID 99 to affiliate ID 5
update_post_meta(99, '_fa_affiliate_id', 5);
```

Or via WooCommerce admin: open the coupon, go to the **FluentAffiliate** tab, and select an affiliate.

If both a coupon and a click-through visit exist, the click-through takes priority unless the coupon affiliate has explicitly been set.

## My Account Menu Integration

When `is_enable_woo_menu` is enabled in settings, a link to the affiliate portal is added to the WooCommerce My Account page:

```
My Account
├── Dashboard
├── Orders
├── Affiliate Portal  ← added by FluentAffiliate
└── ...
```

### Filter: Menu Position

```php
add_filter('fluent_affiliate/woo_menu_link_position', function($position) {
    return 5; // Move to top of account menu (lower number = higher position)
});
```

### Filter: Menu Label

```php
add_filter('fluent_affiliate/woo_menu_label', function($label) {
    return __('My Referral Dashboard', 'my-plugin');
});
```

## Subscription Renewals

Requires **WooCommerce Subscriptions** plugin. When a subscription renews, the original referring affiliate earns a recurring commission (if enabled). See [Recurring Commissions](/guides/recurring-commissions).

## Filter Hooks

### `fluent_affiliate/formatted_order_data_by_woo`

Modify the normalised order data before a referral is created.

```php
add_filter('fluent_affiliate/formatted_order_data_by_woo', function($data, $order) {
    // Add UTM campaign from WC order meta
    $data['utm_campaign'] = $order->get_meta('utm_campaign');
    return $data;
}, 10, 2);
```

### `fluent_affiliate/commission` (with WooCommerce context)

```php
add_filter('fluent_affiliate/commission', function($commission, $context) {
    // Exclude shipping from commission base
    if (isset($context['order'])) {
        $order = $context['order'];
        $commission -= $order->get_shipping_total() * ($context['rate'] / 100);
    }
    return $commission;
}, 10, 2);
```

### `fluent_affiliate/affiliate_attached_coupons` (WooCommerce context)

```php
add_filter('fluent_affiliate/affiliate_attached_coupons', function($coupons, $affiliate, $context) {
    // Add a programmatically-created coupon
    if ($context === 'portal') {
        $coupons[] = [
            'code'     => 'AFF' . strtoupper($affiliate->custom_param),
            'discount' => '10%',
        ];
    }
    return $coupons;
}, 10, 3);
```

## Self-Referral Prevention

The integration calls `BaseConnector::isSelfReferral()` before recording a referral. If the purchasing customer is the same WordPress user as the affiliate, the referral is skipped.

## Provider Reference URL

Clicking a referral's order link in the FluentAffiliate admin opens the WooCommerce order edit page. To customise:

```php
add_filter('fluent_affiliate/provider_reference_woo_url', function($url, $referral) {
    return admin_url('post.php?post=' . $referral->provider_id . '&action=edit');
}, 10, 2);
```
