---
title: Portal
description: Action hooks in the Portal category.
---

# Portal

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/render_login_form`](#fluent-affiliate-render-login-form) | Fired inside the portal login form template. |
| [`fluent_affiliate/render_signup_form`](#fluent-affiliate-render-signup-form) | Fired inside the portal sign-up form template. |
| [`fluent_affiliate/email_head`](#fluent-affiliate-email-head) | Fired inside the `<head>` section of the FluentAffiliate email template. |

## `fluent_affiliate/render_login_form`

Fired inside the portal login form template. Use to output custom HTML before the default form.

**Source:** `app/Modules/Portal/CustomerPortal.php`

```php
add_action('fluent_affiliate/render_login_form', function() {
    echo '<p class="notice">Please log in to view your affiliate dashboard.</p>';
});
```

## `fluent_affiliate/render_signup_form`

Fired inside the portal sign-up form template.

**Source:** `app/Modules/Portal/CustomerPortal.php`

```php
add_action('fluent_affiliate/render_signup_form', function() {
    echo '<div class="custom-signup-notice">Join today!</div>';
});
```

## `fluent_affiliate/email_head`

Fired inside the `<head>` section of the FluentAffiliate email template. Use to inject custom CSS.

**Source:** `app/Views/email/email_template.php`

```php
add_action('fluent_affiliate/email_head', function() {
    echo '<style>body { font-family: Arial, sans-serif; }</style>';
});
```

