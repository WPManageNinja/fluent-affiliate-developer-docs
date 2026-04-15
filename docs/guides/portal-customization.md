---
title: Portal Customization
description: Customize the FluentAffiliate affiliate portal — CSS variables, menu items, login/signup forms, and localized data.
---

# Portal Customization

The affiliate portal is rendered by the `[fluent_affiliate_portal]` shortcode. It loads a Vue 3 SPA (`assets/public/customer/app.js`) inside a `<div id="fa-customer-portal">` wrapper on any page.

## CSS Custom Properties

The portal uses CSS custom properties (variables) so you can restyle it from your theme without overriding compiled CSS. Add these to your theme's `style.css` or a `wp_enqueue_scripts` callback:

```css
#fa-customer-portal {
    --fa-primary-color:  #0E121B;   /* Primary text color */
    --fa-color-off:      #60646B;   /* Secondary/muted text */
    --fa-primary-border: #E1E4EA;   /* Border color */
    --fa-box-bg:         #FFFFFF;   /* Card / panel background */
    --fa-heading-bg:     #F9FAFB;   /* Section heading background */
    --fa-active-bg:      #f0f3f5;   /* Active / hover state background */
}
```

**Example — dark mode:**

```css
@media (prefers-color-scheme: dark) {
    #fa-customer-portal {
        --fa-primary-color:  #F5F5F5;
        --fa-color-off:      #A0A6B0;
        --fa-primary-border: #3A3D45;
        --fa-box-bg:         #1C1E26;
        --fa-heading-bg:     #15171E;
        --fa-active-bg:      #2A2D36;
    }
}
```

## Shortcode Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `layout` | `classic`, `modern` | `classic` | Switches between the classic and modern portal layout |

```php
// Classic layout (default)
[fluent_affiliate_portal]

// Modern layout
[fluent_affiliate_portal layout="modern"]
```

## Customize Portal Menu Items

Use the `fluent_affiliate/portal_menu_items` filter to add, remove, or reorder navigation items in the affiliate portal sidebar.

```php
add_filter('fluent_affiliate/portal_menu_items', function($menuItems) {
    // Disable the Creatives (Promo Materials) menu item
    $menuItems['creatives']['enabled'] = false;

    // Rename an existing item
    $menuItems['home']['title'] = __('My Dashboard', 'my-plugin');

    return $menuItems;
});
```

**Default menu keys:** `home`, `links`, `creatives`, `referrals`, `payouts`, `settings`

### Add a Custom Menu Item

```php
add_filter('fluent_affiliate/portal_menu_items', function($menuItems) {
    $menuItems['my_resources'] = [
        'title'   => __('Resources', 'my-plugin'),
        'enabled' => true,
        'icon'    => '<svg>...</svg>',
        'route'   => ['name' => 'my_resources'],  // matches a Vue route name
    ];
    return $menuItems;
});
```

## Customize Portal Localized Data

The portal receives a JavaScript object (`window.fluentAffiliatePortal`) with site info, affiliate data, and feature flags. Use `fluent_affiliate/portal_localize_data` to add your own keys or override existing ones.

```php
add_filter('fluent_affiliate/portal_localize_data', function($portalData) {
    // Add a custom key readable in the portal JS
    $portalData['my_plugin'] = [
        'feature_enabled' => true,
        'api_endpoint'    => rest_url('my-plugin/v1/'),
    ];

    // Override the default share URL
    $portalData['site_info']['share_url'] = home_url('/special-landing/');

    return $portalData;
});
```

## Override the Default Share URL

```php
add_filter('fluent_affiliate/default_share_url', function($url, $affiliate) {
    // Each affiliate gets a share URL pointing to their category page
    return home_url('/shop/?ref=' . $affiliate->affiliate_code);
}, 10, 2);
```

## Add Multi-Domain Tracking Sites

If you run multiple sites on different domains and want affiliates to see tracking links for all of them:

```php
add_filter('fluent_affiliate/portal/additional_sites', function($sites) {
    $sites[] = [
        'label' => 'Store B',
        'url'   => 'https://store-b.example.com',
    ];
    return $sites;
});
```

## Customize Portal Status Messages

### Pending Application Message

```php
add_filter('fluent_affiliate/portal/pending_message', function($html, $affiliate) {
    return '<div class="my-pending-notice">
        <h3>' . __('Application Under Review', 'my-plugin') . '</h3>
        <p>' . sprintf(
            __('Hi %s, we\'ll email you at %s when your application is approved.', 'my-plugin'),
            esc_html($affiliate->user->display_name),
            esc_html($affiliate->user->user_email)
        ) . '</p>
    </div>';
}, 10, 2);
```

### Inactive / Rejected Account Message

```php
add_filter('fluent_affiliate/portal/inactive_message', function($html, $affiliate) {
    return '<div class="my-inactive-notice">
        <p>' . __('Your affiliate account is currently inactive. Contact support to reinstate it.', 'my-plugin') . '</p>
    </div>';
}, 10, 2);
```

## Replace the Login Form

The `fluent_affiliate/render_login_form` action fires when a logged-out user visits the portal page. Use it to render a custom login form instead of the default WordPress one:

```php
add_action('fluent_affiliate/render_login_form', function() {
    // Render a custom login form
    echo do_shortcode('[custom_login_form redirect="' . get_permalink() . '"]');
});
```

## Replace the Signup Form

The `fluent_affiliate/render_signup_form` action fires when a logged-in user visits the portal but is not yet an affiliate:

```php
add_action('fluent_affiliate/render_signup_form', function() {
    echo '<div class="my-signup-form">';
    echo do_shortcode('[fluent_affiliate_registration_form]');
    echo '</div>';
});
```
