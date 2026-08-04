---
title: Auth
description: Filter hooks in the Auth category.
---

# Auth

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/auth/custom_field_values`](#fluent-affiliate-auth-custom-field-values) | Collects and validates values for custom registration fields during affiliate signup and portal profile updates. |
| [`fluent_affiliate/auth/pre_registration_errors`](#fluent-affiliate-auth-pre-registration-errors) | Runs before an affiliate registration is accepted, after field sanitization. |
| [`fluent_affiliate/auth/after_login_redirect_url`](#fluent-affiliate-auth-after-login-redirect-url) | Filters the URL the affiliate is redirected to after logging in. |
| [`fluent_affiliate/auth/after_signup_redirect_url`](#fluent-affiliate-auth-after-signup-redirect-url) | Filters the URL the affiliate is redirected to after signing up. |
| [`fluent_affiliate/terms_policy_url`](#fluent-affiliate-terms-policy-url) | Filters the Terms & Privacy Policy URL shown on the affiliate sign-up form. |
| [`fluent_affiliate/auth/signup_fields`](#fluent-affiliate-auth-signup-fields) | Filters the form fields shown on the affiliate registration form. |
| [`fluent_affiliate/auth/lost_password_url`](#fluent-affiliate-auth-lost-password-url) | Filters the lost password URL linked on the affiliate login form. |
| [`fluent_affiliate/auth/signup_verification_email_body`](#fluent-affiliate-auth-signup-verification-email-body) | Filters the body of the email verification message sent during sign-up. |
| [`fluent_affiliate/reserved_usernames`](#fluent-affiliate-reserved-usernames) | Filters the list of usernames that affiliates are not allowed to register. |
| [`fluent_affiliate/auth/auto_approve_affiliates`](#fluent-affiliate-auth-auto-approve-affiliates) | Filters whether new affiliates are automatically approved on registration. |
| [`fluent_affiliate/captcha_providers`](#fluent-affiliate-captcha-providers) | Registers the captcha providers available on the registration form <span class="pro-badge">PRO</span>. |
| [`fluent_affiliate/recaptcha_remoteip`](#fluent-affiliate-recaptcha-remoteip) | Filters the `remoteip` value sent to Google when verifying a reCAPTCHA response <span class="pro-badge">PRO</span>. |
| [`fluent_affiliate/recaptcha_v3_ref_score`](#fluent-affiliate-recaptcha-v3-ref-score) | Filters the reCAPTCHA v3 score threshold a registration must meet to be accepted <span class="pro-badge">PRO</span>. |

## `fluent_affiliate/auth/custom_field_values`

Collects and validates values for custom registration fields during affiliate signup and portal profile updates. Merge into the accumulated array and return it, or return a `WP_Error` to abort with a validation message. Pro's custom registration fields feature hooks here.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$values` | `array` | Accumulated custom field values — merge into this, do not replace it. |
| `$fields` | `array` | Registration form field definitions. |
| `$submitted` | `array` | Submitted values restricted to the known field keys. |

**Source:** `app/Http/Controllers/Portal/PortalController.php`

```php
add_filter('fluent_affiliate/auth/custom_field_values', function($values, $fields, $submitted) {
    if (empty($submitted['company'])) {
        return new \WP_Error('validation_failed', 'Company is required.');
    }
    $values['company'] = sanitize_text_field($submitted['company']);
    return $values;
}, 10, 3);
```

## `fluent_affiliate/auth/pre_registration_errors`

Runs before an affiliate registration is accepted, after field sanitization. Return a non-empty array to reject the request with HTTP 422. Pro's captcha verification hooks here.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$errors` | `array` | Error payload — return `[]` to allow, or `['message' => string, 'errors' => array]` to block. |
| `$data` | `array` | Sanitized registration data. |
| `$request` | `Request` | The current request object. |

**Source:** `app/Modules/Auth/AuthHandler.php`

```php
add_filter('fluent_affiliate/auth/pre_registration_errors', function($errors, $data, $request) {
    if (str_ends_with($data['email'], '@example.test')) {
        $errors['message'] = 'This email domain is not allowed.';
    }
    return $errors;
}, 10, 3);
```

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

## `fluent_affiliate/captcha_providers`

Registers the captcha providers available on the registration form <span class="pro-badge">PRO</span>. Add an instance of a class extending `FluentAffiliatePro\App\Services\Captcha\AbstractCaptchaProvider` to offer an alternative to the bundled Google reCAPTCHA provider. Entries that are not `AbstractCaptchaProvider` instances are ignored, and each provider is keyed by its `getKey()`.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$providers` | `array` | Provider instances keyed by provider key — defaults to `['recaptcha' => new RecaptchaProvider()]`. |

**Source:** `../fluent-affiliate-pro/app/Services/Captcha/CaptchaManager.php`

```php
add_filter('fluent_affiliate/captcha_providers', function($providers) {
    $providers['turnstile'] = new My_Turnstile_Provider(); // extends AbstractCaptchaProvider
    return $providers;
});
```

## `fluent_affiliate/recaptcha_remoteip`

Filters the `remoteip` value sent to Google when verifying a reCAPTCHA response <span class="pro-badge">PRO</span>. Return an empty string to omit the parameter entirely (data minimization) — Google treats it as optional.

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$ip` | `string` | Detected visitor IP (Cloudflare / X-Forwarded-For / REMOTE_ADDR). |
| `$settings` | `array` | The active provider settings. |

**Source:** `../fluent-affiliate-pro/app/Services/Captcha/RecaptchaProvider.php`

```php
// Don't send visitor IPs to Google
add_filter('fluent_affiliate/recaptcha_remoteip', '__return_empty_string');
```

## `fluent_affiliate/recaptcha_v3_ref_score`

Filters the reCAPTCHA v3 score threshold a registration must meet to be accepted <span class="pro-badge">PRO</span>. Scores below the threshold are rejected. Defaults to the provider's `v3_score_threshold` setting (0.5).

> **Requires FluentAffiliate Pro.**

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$threshold` | `float` | Minimum acceptable score, 0.0–1.0. |

**Source:** `../fluent-affiliate-pro/app/Services/Captcha/RecaptchaProvider.php`

```php
add_filter('fluent_affiliate/recaptcha_v3_ref_score', function($threshold) {
    return 0.7; // stricter
});
```

