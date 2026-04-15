---
title: Recurring Commissions (Pro)
description: Automatically pay affiliates a commission on subscription renewals using the Recurring Commissions feature.
---

# Recurring Commissions <span class="pro-badge">PRO</span>

The Recurring Commissions feature automatically tracks and records affiliate commissions for subscription renewals. When a referred customer renews their subscription, the original referring affiliate earns a configurable commission.

## Supported Integrations

| Integration | Notes |
|-------------|-------|
| WooCommerce Subscriptions | Hooks into `woocommerce_subscription_renewal_payment_complete`. |
| FluentCart (recurring) | Hooks into FluentCart's renewal payment events. |

## Configuration

Settings are stored in the Referral Config (`_fa_referral_config` option) under these keys:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enable_subscription_renewal` | `string` | `no` | `yes` to enable recurring commissions. |
| `renewal_rate_type` | `string` | `percentage` | `percentage` or `fixed` commission type. |
| `renewal_rate` | `float` | `0` | Commission rate for renewals. |
| `max_renewal_count` | `int` | `0` | Maximum number of renewal commissions per affiliate. `0` = unlimited. |

### In the Admin UI

Go to **Settings → Referral Program → Subscription Renewals**.

### Programmatically

```php
// Read the current config
$config = \FluentAffiliate\App\Services\Settings::getReferralConfig();
$renewalEnabled  = $config['enable_subscription_renewal'] ?? 'no';
$renewalRate     = (float)($config['renewal_rate'] ?? 0);
$renewalRateType = $config['renewal_rate_type'] ?? 'percentage';
$maxRenewals     = (int)($config['max_renewal_count'] ?? 0);
```

## Per-Group Recurring Settings

When recurring commissions are enabled, **each affiliate group** can have its own recurring rate overrides. Group-level recurring settings are stored alongside the group's `rate` and `rate_type` in the `fa_meta` `value` column:

```json
{
  "rate_type": "percentage",
  "rate": 20,
  "status": "active",
  "enable_subscription_renewal": "yes",
  "renewal_rate_type": "percentage",
  "renewal_rate": 10,
  "max_renewal_count": 12
}
```

## Referral Type

Recurring referrals are stored with `type = 'recurring_sale'` in `fa_referrals`, distinguishing them from one-time `sale` referrals.

## Filter Hook

### `fluent_affiliate/recurring_commission`

Filter the commission amount and data before it is recorded for a renewal.

```php
add_filter('fluent_affiliate/recurring_commission', function($commissionData, $context) {
    // $commissionData keys: amount, rate, rate_type, renewal_count, max_renewal_count
    // $context keys: order, affiliate, referral (original referral object)

    // Cap commission at $50 per renewal
    $commissionData['amount'] = min($commissionData['amount'], 50.00);

    // Stop commissions after 6 renewals for a specific group
    $affiliate = $context['affiliate'];
    if ($affiliate->group_id === 3 && $commissionData['renewal_count'] > 6) {
        $commissionData['amount'] = 0; // Will be skipped if amount is 0
    }

    return $commissionData;
}, 10, 2);
```

## Query Recurring Referrals

```php
use FluentAffiliate\App\Models\Referral;

// Get all recurring referrals for an affiliate
$recurringReferrals = Referral::where('affiliate_id', $affiliateId)
    ->where('type', 'recurring_sale')
    ->ofStatus('unpaid')
    ->sum('amount');

// Count renewals per affiliate
$renewalCounts = Referral::where('type', 'recurring_sale')
    ->where('status', 'paid')
    ->groupBy('affiliate_id')
    ->selectRaw('affiliate_id, COUNT(*) as renewal_count')
    ->get();
```

## Action Hook Integration

Recurring commissions generate the standard referral lifecycle hooks, with the referral's `type` set to `recurring_sale`:

```php
add_action('fluent_affiliate/referral_created', function($referral) {
    if ($referral->type === 'recurring_sale') {
        // Custom notification for recurring commissions
        my_plugin_notify_recurring_commission($referral);
    }
});
```

## WooCommerce Coupons & Recurring

WooCommerce coupon-to-affiliate mapping (via `_fa_affiliate_id` post meta on the coupon) also applies to subscription renewals — the mapped affiliate will be credited for recurring commissions if enabled.

See [WooCommerce Integration](/guides/integrations/woocommerce) for details on coupon mapping.
