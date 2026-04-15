---
title: Auth
description: Filter hooks in the Auth category.
---

# Auth

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/auth/after_login_redirect_url`](#fluent-affiliate-auth-after-login-redirect-url) | Filters the URL the affiliate is redirected to after logging in. |
| [`fluent_affiliate/auth/after_signup_redirect_url`](#fluent-affiliate-auth-after-signup-redirect-url) | Filters the URL the affiliate is redirected to after signing up. |
| [`fluent_affiliate/terms_policy_url`](#fluent-affiliate-terms-policy-url) | Filters the Terms & Privacy Policy URL shown on the affiliate sign-up form. |
| [`fluent_affiliate/auth/signup_fields`](#fluent-affiliate-auth-signup-fields) | Filters the form fields shown on the affiliate registration form. |
| [`fluent_affiliate/auth/lost_password_url`](#fluent-affiliate-auth-lost-password-url) | Filters the lost password URL linked on the affiliate login form. |
| [`fluent_affiliate/auth/signup_verification_email_body`](#fluent-affiliate-auth-signup-verification-email-body) | Filters the body of the email verification message sent during sign-up. |
| [`fluent_affiliate/reserved_usernames`](#fluent-affiliate-reserved-usernames) | Filters the list of usernames that affiliates are not allowed to register. |
| [`fluent_affiliate/auth/auto_approve_affiliates`](#fluent-affiliate-auth-auto-approve-affiliates) | Filters whether new affiliates are automatically approved on registration. |

## `fluent_affiliate/auth/after_login_redirect_url`

Filters the URL the affiliate is redirected to after logging in.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | Redirect URL. |
| `$user` | `WP_User` | The logged-in user. |

**Source:** `app/Modules/Auth/AuthHandler.php`

```php
add_filter('fluent_affiliate/auth/after_login_redirect_url', function($url, $user) {
    return home_url('/affiliates/');
}, 10, 2);
```

## `fluent_affiliate/auth/after_signup_redirect_url`

Filters the URL the affiliate is redirected to after signing up.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | Redirect URL. |
| `$user` | `WP_User` | The newly created user. |
| `$request` | `array` | The submitted sign-up form data. |

**Source:** `app/Modules/Auth/AuthHandler.php`

```php
add_filter('fluent_affiliate/auth/after_signup_redirect_url', function($url, $user, $request) {
    return home_url('/affiliates/welcome/');
}, 10, 3);
```

## `fluent_affiliate/terms_policy_url`

Filters the Terms & Privacy Policy URL shown on the affiliate sign-up form.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | Policy URL (defaults to `get_privacy_policy_url()`). |

**Source:** `app/Modules/Auth/AuthHelper.php`

```php
add_filter('fluent_affiliate/terms_policy_url', function($url) {
    return home_url('/affiliate-terms/');
});
```

## `fluent_affiliate/auth/signup_fields`

Filters the form fields shown on the affiliate registration form.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$fields` | `array` | Form field definitions. |
| `$user` | `WP_User` | Current user (if logged in). |

**Source:** `app/Modules/Auth/AuthHelper.php`

```php
add_filter('fluent_affiliate/auth/signup_fields', function($fields, $user) {
    $fields['company'] = [
        'label'    => 'Company Name',
        'type'     => 'text',
        'required' => false,
    ];
    return $fields;
}, 10, 2);
```

## `fluent_affiliate/auth/lost_password_url`

Filters the lost password URL linked on the affiliate login form.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$url` | `string` | Lost password URL. |

**Source:** `app/Modules/Auth/AuthHelper.php`

```php
add_filter('fluent_affiliate/auth/lost_password_url', function($url) {
    return wp_lostpassword_url(home_url('/affiliate-login/'));
});
```

## `fluent_affiliate/auth/signup_verification_email_body`

Filters the body of the email verification message sent during sign-up.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$message` | `string` | Email body HTML. |
| `$verificationCode` | `string` | The verification code. |
| `$formData` | `array` | Submitted form data. |

**Source:** `app/Modules/Auth/AuthHelper.php`

```php
add_filter('fluent_affiliate/auth/signup_verification_email_body', function($message, $code, $formData) {
    return $message . '<p>Your code expires in 30 minutes.</p>';
}, 10, 3);
```

## `fluent_affiliate/reserved_usernames`

Filters the list of usernames that affiliates are not allowed to register.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$reserved` | `array` | Array of reserved username strings. |

**Source:** `app/Modules/Auth/AuthHelper.php`

```php
add_filter('fluent_affiliate/reserved_usernames', function($reserved) {
    $reserved[] = 'admin';
    $reserved[] = 'affiliate';
    return $reserved;
});
```

## `fluent_affiliate/auth/auto_approve_affiliates`

Filters whether new affiliates are automatically approved on registration.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$autoApprove` | `bool` | `true` to auto-approve. Default `false`. |

**Source:** `app/Modules/Auth/AuthHelper.php`

```php
add_filter('fluent_affiliate/auth/auto_approve_affiliates', '__return_true');
```

