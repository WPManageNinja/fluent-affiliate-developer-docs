---
title: Guides
description: Developer guides for FluentAffiliate — custom integrations, Pro features, and e-commerce plugin integration.
---

# Guides

Practical guides for extending and customizing FluentAffiliate.

## Getting Started

### [Custom Integration Guide](/guides/custom-integration)

Build a complete e-commerce or booking integration using the `BaseConnector` + `BaseConnectorSettings` two-class pattern. Covers the full referral lifecycle — order events, commission calculation, customer records, self-referral prevention, and refund handling.

### [Code Snippets](/guides/code-snippets)

Source-verified, ready-to-use PHP snippets for the most common customization tasks: auto-approving affiliates, capping commissions, sending custom notifications, modifying portal menus, and more.

---

## Pro Features

### [Affiliate Groups](/guides/affiliate-groups)

Segment affiliates into groups with custom commission rates. Groups are stored in `fa_meta` with per-group `rate_type`, `rate`, and `status`. Includes REST API, lifecycle hooks, and programmatic usage.

### [Creatives](/guides/creatives)

Manage affiliate marketing assets — banners, images, text links, HTML — with scheduling (WP Action Scheduler), affiliate/group targeting, and portal display filtering.

### [Social Media Share](/guides/social-share)

Configure the affiliate portal's social sharing widget. 8 built-in platforms, developer filters to add custom platforms, and feature settings hooks.

### [Permission Manager](/guides/permission-manager)

Grant non-admin WordPress users granular access to FluentAffiliate data — view affiliates, manage referrals, process payouts — without full admin access.

### [Connected Sites / Multi-Domain](/guides/connected-sites)

Track affiliates across multiple WordPress sites. Token-based cross-site authentication with a single affiliate dashboard on the primary site.

### [Recurring Commissions](/guides/recurring-commissions)

Automatically pay affiliates for subscription renewals. WooCommerce Subscriptions and FluentCart recurring payments supported. Per-group recurring rate overrides.

---

## Integrations

| Integration | Type | Description |
|-------------|------|-------------|
| [WooCommerce](/guides/integrations/woocommerce) | Pro | Orders, subscriptions, coupon mapping, My Account menu. |
| [Easy Digital Downloads](/guides/integrations/edd) | Pro | EDD payment commissions. |
| [SureCart](/guides/integrations/surecart) | Pro | SureCart orders and subscriptions. |
| [FluentCart](/guides/integrations/fluentcart) | Core | FluentCart orders and subscriptions. |
| [Fluent Forms](/guides/integrations/fluentforms) | Core | Affiliate registration via form feed. |
| [LifterLMS](/guides/integrations/others#lifterlms) | Pro | Course and membership commissions. |
| [GiveWP](/guides/integrations/others#givewp) | Pro | Donation commissions. |
| [MemberPress](/guides/integrations/others#memberpress) | Pro | Membership purchase commissions. |
| [Paid Memberships Pro](/guides/integrations/others#paid-memberships-pro-pmp) | Pro | PMP order commissions. |
| [TutorLMS](/guides/integrations/others#tutorlms) | Pro | Course purchase commissions (Pro version required). |
| [ProfilePress](/guides/integrations/others#profilepress) | Pro | Membership plan commissions. |
| [Paymattic](/guides/integrations/others#paymattic) | Pro | Payment form commissions and registration feed. |
| [FluentBooking](/guides/integrations/others#fluentbooking) | Pro | Booking payment commissions. |
| [Voxel](/guides/integrations/others#voxel) | Pro | Marketplace transaction commissions. |

---

## Where to Add Custom Code

Add customizations to a **custom plugin** or an **MU plugin** (`wp-content/mu-plugins/`). Avoid editing FluentAffiliate directly — your changes will be overwritten on plugin updates.

```php
<?php
/**
 * Plugin Name: My FluentAffiliate Customizations
 * Description: Custom hooks and modifications for FluentAffiliate.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

add_action('plugins_loaded', function () {
    if (!defined('FLUENT_AFFILIATE_VERSION')) {
        return; // FluentAffiliate not active
    }

    // Your customizations here
});
```
