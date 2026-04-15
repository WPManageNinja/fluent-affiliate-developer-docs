---
title: Custom Integration Guide
description: Build a custom e-commerce integration for FluentAffiliate using the BaseConnector pattern.
---

# Custom Integration Guide

## Overview

Custom integrations connect an external plugin (e-commerce, booking, forms) to FluentAffiliate's referral and commission system. Each integration consists of two classes:

1. **Bootstrap** — extends `BaseConnector`. Hooks into the external plugin's events (order created, paid, refunded). Contains all referral lifecycle logic.
2. **Connector** — extends `BaseConnectorSettings`. Provides integration metadata and admin settings schema used by the settings UI.

Integrations are loaded in `CoreIntegrationsInit::register()` by checking for the external plugin's version constant (e.g., `defined('FLUENTCART_VERSION')`).

## File Structure

```
app/Modules/Integrations/
└── MyPlugin/
    ├── Bootstrap.php      # Hooks + referral logic
    └── Connector.php      # Metadata + settings UI
```

If you are building an external integration (outside the FluentAffiliate plugin directory), create the same two-class structure in your own plugin and register it on `plugins_loaded`.

## Bootstrap Class

The Bootstrap class is where all referral tracking logic lives. It hooks into your external plugin's events and calls `BaseConnector` methods to record referrals.

```php
<?php

namespace FluentAffiliate\App\Modules\Integrations\MyPlugin;

use FluentAffiliate\App\Modules\Integrations\BaseConnector;

class Bootstrap extends BaseConnector
{
    protected $key = 'myplugin'; // Unique integration key — must match Connector::getKey()

    public function init()
    {
        // Hook into the external plugin's "order completed" event
        add_action('myplugin_order_completed', [$this, 'handleOrderCompleted'], 10, 2);
        add_action('myplugin_order_refunded', [$this, 'handleOrderRefunded']);
    }

    public function handleOrderCompleted($orderId, $orderData)
    {
        // 1. Check if this integration is enabled in settings
        if (!$this->isEnabled()) {
            return;
        }

        // 2. Get the current affiliate from tracking cookie
        $affiliate = $this->getCurrentAffiliate();
        if (!$affiliate) {
            return;
        }

        // 3. Prevent self-referrals
        $customerData = ['email' => $orderData['customer_email']];
        if ($this->isSelfReferred($affiliate, $customerData)) {
            return;
        }

        // 4. Check for an existing referral on this order (idempotency guard)
        if ($this->getExistingReferral($orderId)) {
            return;
        }

        // 5. Calculate commission
        $orderTotal = $orderData['total'];
        $commission = $this->calculateFinalCommissionAmount($affiliate, [
            'total' => $orderTotal,
        ]);

        // 6. Create or find the customer record
        $customer = $this->addOrUpdateCustomer([
            'email'      => $orderData['customer_email'],
            'first_name' => $orderData['first_name'],
            'last_name'  => $orderData['last_name'],
        ]);

        // 7. Record the referral
        $referral = $this->recordReferral([
            'affiliate_id' => $affiliate->id,
            'customer_id'  => $customer->id,
            'visit_id'     => optional($this->getCurrentVisit($affiliate))->id,
            'description'  => 'Order #' . $orderId,
            'amount'       => $commission,
            'order_total'  => $orderTotal,
            'currency'     => $orderData['currency'],
            'provider'     => $this->key,
            'provider_id'  => $orderId,
            'type'         => 'sale',
        ]);

        // 8. Mark the referral as unpaid (approved, ready for payout)
        $this->markReferralAsUnpaid($referral);
    }

    public function handleOrderRefunded($orderId)
    {
        $referral = $this->getExistingReferral($orderId);
        if ($referral) {
            $this->rejectReferral($referral, 'Order refunded');
        }
    }
}
```

## Connector Class

The Connector class provides metadata used by the admin settings UI.

```php
<?php

namespace FluentAffiliate\App\Modules\Integrations\MyPlugin;

use FluentAffiliate\App\Modules\Integrations\BaseConnectorSettings;

class Connector extends BaseConnectorSettings
{
    public function getKey()
    {
        return 'myplugin'; // Must match Bootstrap::$key
    }

    public function getTitle()
    {
        return 'My Plugin';
    }

    public function getDescription()
    {
        return 'Track referrals from My Plugin orders.';
    }

    public function isEnabled()
    {
        $config = $this->getConfig();
        return !empty($config['status']) && $config['status'] === 'yes';
    }
}
```

## Registering the Integration

### Within FluentAffiliate (core or bundled integrations)

In `app/Modules/Integrations/CoreIntegrationsInit.php`, add a conditional block inside `register()`:

```php
if (defined('MYPLUGIN_VERSION')) {
    (new MyPlugin\Bootstrap())->init();
}
```

### From an External Plugin

Register from your own plugin's `plugins_loaded` hook after verifying both plugins are active:

```php
add_action('plugins_loaded', function () {
    if (!defined('FLUENT_AFFILIATE_VERSION')) {
        return;
    }

    if (!defined('MYPLUGIN_VERSION')) {
        return;
    }

    $bootstrap = new \MyNamespace\FluentAffiliateIntegration\Bootstrap();
    $bootstrap->init();
});
```

Register your Connector so it appears in the integrations settings list:

```php
add_filter('fluent_affiliate/get_integrations', function ($integrations) {
    $integrations['myplugin'] = new \MyNamespace\FluentAffiliateIntegration\Connector();
    return $integrations;
});
```

## BaseConnector Reference

All methods listed below are available inside Bootstrap classes that extend `BaseConnector`.

| Method | Returns | Description |
|---|---|---|
| `getCurrentAffiliate()` | Affiliate\|null | Get the affiliate from the active tracking cookie |
| `getCurrentVisit($affiliate)` | Visit\|null | Get the click record that brought this visitor |
| `getExistingReferral($providerId)` | Referral\|null | Check if a referral already exists for this provider+order ID combination |
| `addOrUpdateCustomer($data)` | Customer | Create or update a customer record by email |
| `recordReferral($data)` | Referral | Save a new referral and fire `fluent_affiliate/referral_created` |
| `rejectReferral($referral, $reason)` | Referral | Reject a referral and fire `fluent_affiliate/referral_marked_rejected` |
| `markReferralAsUnpaid($referral)` | Referral | Approve a referral and fire `fluent_affiliate/referral_marked_unpaid` |
| `updateReferralCommission($referral, $order)` | Referral | Recalculate commission and fire `fluent_affiliate/referral_commission_updated` |
| `isSelfReferred($affiliate, $customerData)` | bool | Check if the affiliate and the customer are the same WordPress user |
| `calculateFinalCommissionAmount($affiliate, $orderData, $taxonomy)` | float | Calculate commission respecting global defaults, group overrides, and product-level rates |
| `calculateOrderTotal($totals)` | float | Sum order total from subtotal, shipping, tax, and discount fields |
| `centsToDecimal($cents, $currency)` | float | Convert integer cents to decimal amount (handles zero-decimal currencies like JPY) |
| `isEnabled()` | bool | Check if this integration is enabled in plugin settings |
| `getConfig()` | array | Get this integration's saved configuration array |
| `getSetting($key)` | mixed | Get a single setting value by key |

## Referral Lifecycle Hooks

These actions fire automatically when you call the corresponding `BaseConnector` methods:

| Hook | Fires when |
|---|---|
| `fluent_affiliate/referral_created` | `recordReferral()` saves a new referral |
| `fluent_affiliate/referral_marked_unpaid` | `markReferralAsUnpaid()` approves a referral |
| `fluent_affiliate/referral_marked_rejected` | `rejectReferral()` rejects a referral |
| `fluent_affiliate/referral_commission_updated` | `updateReferralCommission()` recalculates commission |

## Tips

- **Idempotency:** Always call `getExistingReferral($orderId)` before `recordReferral()`. This prevents duplicate referrals if your order event fires more than once.
- **Pending vs. unpaid:** Call `recordReferral()` first (creates a `pending` referral), then call `markReferralAsUnpaid()` once payment is confirmed. For order systems where payment is confirmed at order creation, both calls can be sequential in the same handler.
- **Zero-amount referrals:** By default, FluentAffiliate skips referrals where `calculateFinalCommissionAmount()` returns zero. Override this with the `fluent_affiliate/ignore_zero_amount_referral` filter if needed.
- **Currency handling:** Use `centsToDecimal()` if the external plugin stores amounts as integers (e.g., Stripe amounts in cents).
