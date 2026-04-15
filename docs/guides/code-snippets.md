---
title: Code Snippets
description: Source-verified PHP snippets for common FluentAffiliate customizations.
---

# Code Snippets

::: tip
These snippets are validated against the current core and Pro source trees. Add them to a custom plugin or an MU plugin rather than editing FluentAffiliate directly.
:::

## Auto-Approve New Affiliates

Automatically approve all new affiliate applications without manual review.

```php
add_filter('fluent_affiliate/auth/auto_approve_affiliates', '__return_true');
```

## Redirect Affiliates After Login

Send affiliates to a custom URL after they log in to the portal.

```php
add_filter('fluent_affiliate/auth/after_login_redirect_url', function ($redirectUrl, $user) {
    return home_url('/affiliate-dashboard/');
}, 10, 2);
```

## Add a Custom Portal Menu Item

Append a menu item to the affiliate portal navigation.

```php
add_filter('fluent_affiliate/portal_menu_items', function ($menuItems) {
    $menuItems[] = [
        'key'   => 'resources',
        'label' => 'Resources',
        'icon'  => 'el-icon-document',
        'route' => 'resources',
    ];
    return $menuItems;
}, 10, 1);
```

## Customize the Pending Affiliate Message

Override the message shown to affiliates whose application is still pending.

```php
add_filter('fluent_affiliate/portal/pending_message', function ($html, $affiliate) {
    return '<p>Your application is under review. We will contact you within 2 business days.</p>';
}, 10, 2);
```

## Cap Commission at a Maximum Amount

Prevent commission from exceeding a fixed ceiling regardless of order size.

```php
add_filter('fluent_affiliate/commission', function ($commission, $context) {
    return min($commission, 100.00); // Cap at $100
}, 10, 2);
```

## Record Zero-Amount Referrals

By default, FluentAffiliate skips referrals where the calculated commission is zero. Remove this guard to record all conversions regardless of commission value.

```php
add_filter('fluent_affiliate/ignore_zero_amount_referral', '__return_false');
```

## Add Custom Data to the Admin SPA

Inject custom variables into the admin SPA's global JavaScript object.

```php
add_filter('fluent_affiliate/admin_vars', function ($vars) {
    $vars['my_plugin_enabled'] = defined('MY_PLUGIN_VERSION');
    return $vars;
});
```

## Limit Data Export Rows

Override the maximum number of rows returned by CSV export endpoints.

```php
add_filter('fluent_affiliate/data_export_limit', function ($limit) {
    return 2000;
});
```

## Change the Referral Share Base URL

Override the default URL that affiliates share. Useful when your shop is on a different path.

```php
add_filter('fluent_affiliate/default_share_url', function ($url, $affiliate) {
    return 'https://yoursite.com/shop/';
}, 10, 2);
```

## Use a Custom Avatar URL

Replace the default Gravatar URL with a custom avatar from your own system.

```php
add_filter('fluent_affiliate/affiliate_avatar', function ($gravatarUrl, $email) {
    $custom = my_plugin_get_avatar($email);
    return $custom ?: $gravatarUrl;
}, 10, 2);
```

## Send a Notification on Referral Approval

Fire a custom email when a referral is approved and moves to `unpaid` status.

```php
add_action('fluent_affiliate/referral_marked_unpaid', function ($referral) {
    $affiliate = $referral->affiliate;
    if (!$affiliate) {
        return;
    }
    $wpUser = get_user_by('id', $affiliate->user_id);
    if (!$wpUser) {
        return;
    }
    wp_mail(
        $wpUser->user_email,
        'Your referral has been approved',
        'A referral commission of ' . $referral->amount . ' has been approved.'
    );
}, 10, 1);
```

## Check if Pro is Active

Guard Pro-only code paths behind a constant check.

```php
if (defined('FLUENT_AFFILIATE_PRO')) {
    // Pro features are available
}
```

## Grant Affiliate-Level Access to a Role

Allow a specific WordPress role to access FluentAffiliate admin data without being an administrator.

```php
add_filter('fluent_affiliate/has_all_affiliate_access', function ($hasAccess) {
    if (current_user_can('editor')) {
        return true;
    }
    return $hasAccess;
});
```

## Exclude a Product Category from Referrals

Prevent referrals from being created for orders containing items in a specific category.

```php
add_filter('fluent_affiliate/should_process_referral', function ($shouldProcess, $context) {
    // $context contains 'order', 'affiliate', 'provider' etc.
    if (isset($context['product_category']) && $context['product_category'] === 'gift-cards') {
        return false;
    }
    return $shouldProcess;
}, 10, 2);
```

## Modify the Referral Cookie Duration

Override the cookie lifetime (in days) without changing plugin settings.

```php
add_filter('fluent_affiliate/cookie_expiration_days', function ($days) {
    return 60; // 60-day cookie
});
```

## Log Referral Creation for Debugging

Hook into the referral created action to log data to a custom table or external service.

```php
add_action('fluent_affiliate/referral_created', function ($referral) {
    error_log(sprintf(
        '[FluentAffiliate] Referral #%d created — affiliate #%d, amount %s, provider %s',
        $referral->id,
        $referral->affiliate_id,
        $referral->amount,
        $referral->provider
    ));
}, 10, 1);
```
