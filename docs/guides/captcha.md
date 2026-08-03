---
title: Captcha (Pro)
description: Protect the affiliate registration form with Google reCAPTCHA — settings, key validation, verification flow, and how to register a custom captcha provider.
---

# Captcha <span class="pro-badge">PRO</span>

FluentAffiliate Pro can gate the public affiliate registration form behind a captcha challenge. Google reCAPTCHA (v2 checkbox and v3 invisible) ships built in, and the provider layer is pluggable.

Settings live under **Settings → Registration → Captcha** in the admin SPA.

## Architecture

| Class | Responsibility |
|-------|----------------|
| `CaptchaManager` | Settings storage, provider registry, enable/verify entry points, key-validation bookkeeping |
| `AbstractCaptchaProvider` | Contract every provider implements |
| `RecaptchaProvider` | Bundled Google reCAPTCHA v2/v3 provider (`recaptcha` key) |
| `CaptchaHandler` | Wires the provider into the registration form and the registration request |

`CaptchaHandler::register()` hooks three things:

```php
add_filter('fluent_affiliate/settings_menu_items', ...);          // reveal the Captcha settings screen
add_action('fluent_affiliate/auth/register_form_after_fields', ...); // render the widget
add_filter('fluent_affiliate/auth/pre_registration_errors', ...);    // verify the response
```

## Settings Shape

Stored in the `_captcha_settings` option (via `Utility`):

```php
[
    'enabled'         => 'yes',        // 'yes' | 'no'
    'active_provider' => 'recaptcha',  // provider key
    'providers'       => [
        'recaptcha' => [
            'version'            => 'v2_visible',  // 'v2_visible' | 'v3_invisible'
            'v2_site_key'        => '...',
            'v2_secret_key'      => '...',         // encrypted at rest
            'v3_site_key'        => '...',
            'v3_secret_key'      => '...',         // encrypted at rest
            'v3_score_threshold' => 0.5,           // clamped to 0.0–1.0
            'error_message'      => 'Security check failed. Please try again.',
        ],
    ],
]
```

Secret keys are encrypted with `Helper::encryptDecrypt()` before storage and are **never** returned to the browser — `getDisplaySettings()` swaps them for the `__FA_CAPTCHA_SECRET_KEY__` mask. Posting that mask back means "leave the stored secret unchanged".

## Key Validation Gate

A captcha with bad keys silently breaks registration, so saving is guarded:

1. The admin enters keys and presses **Validate Keys** → `POST /settings/captcha/validate`.
2. `CaptchaManager::validateCredentials()` calls the provider's `validateCredentials()`. On success it stores a fingerprint (`md5` of the sanitized settings) in the `_captcha_validated_fingerprint` option.
3. `POST /settings/captcha` rejects a payload with `enabled = yes` unless the submitted keys' fingerprint matches that stored fingerprint.

`GET /settings/captcha` returns `validated: true|false` so the UI can show whether the active provider's stored keys ever passed.

## Verification Flow

`CaptchaHandler::verify()` runs on `fluent_affiliate/auth/pre_registration_errors`:

- It returns early if an earlier filter already rejected the request, or if `CaptchaManager::isEnabled()` is false (captcha off, or the active provider is not fully configured).
- Otherwise `CaptchaManager::verifyActive($request)` delegates to the provider. A failure returns `['message' => CaptchaManager::getErrorMessage()]`, which the auth handler turns into an HTTP 422.

`RecaptchaProvider::verify()` **fails closed** — any unreachable-API or malformed response denies the registration. For v3 it additionally:

- rejects tokens minted for an action other than `affiliate_register`, and
- requires `score >= v3_score_threshold` (filterable, see below).

## REST API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/settings/captcha` | Settings (secrets masked), provider list, validated flag |
| `POST` | `/settings/captcha` | Save settings — blocked when enabling unvalidated keys |
| `POST` | `/settings/captcha/validate` | Validate a site/secret pair against the provider |

See [Get Captcha Settings](/restapi/operations/settings/get-captcha-settings), [Update Captcha Settings](/restapi/operations/settings/update-captcha-settings), and [Validate Captcha Keys](/restapi/operations/settings/validate-captcha-keys).

## Hooks

| Hook | Type | Purpose |
|------|------|---------|
| [`fluent_affiliate/captcha_providers`](/hooks/filters/auth#fluent-affiliate-captcha-providers) | filter | Register additional providers |
| [`fluent_affiliate/recaptcha_v3_ref_score`](/hooks/filters/auth#fluent-affiliate-recaptcha-v3-ref-score) | filter | Override the v3 score threshold |
| [`fluent_affiliate/recaptcha_remoteip`](/hooks/filters/auth#fluent-affiliate-recaptcha-remoteip) | filter | Change or omit the IP sent to Google |
| [`fluent_affiliate/auth/pre_registration_errors`](/hooks/filters/auth#fluent-affiliate-auth-pre-registration-errors) | filter | The gate captcha verification plugs into |
| [`fluent_affiliate/auth/register_form_after_fields`](/hooks/actions/portal#fluent-affiliate-auth-register-form-after-fields) | action | Where the widget is printed |

### Tighten the v3 threshold

```php
add_filter('fluent_affiliate/recaptcha_v3_ref_score', function ($threshold) {
    return 0.7;
});
```

### Stop sending visitor IPs to Google

```php
add_filter('fluent_affiliate/recaptcha_remoteip', '__return_empty_string');
```

## Adding a Custom Provider

Extend `AbstractCaptchaProvider` and register the instance. Providers are keyed by `getKey()`, and anything that is not an `AbstractCaptchaProvider` instance is discarded.

```php
use FluentAffiliatePro\App\Services\Captcha\AbstractCaptchaProvider;

class My_Turnstile_Provider extends AbstractCaptchaProvider
{
    public function getKey()   { return 'turnstile'; }
    public function getTitle() { return 'Cloudflare Turnstile'; }

    public function getDefaults()
    {
        return [
            'site_key'      => '',
            'secret_key'    => '',
            'error_message' => __('Security check failed. Please try again.', 'my-plugin'),
        ];
    }

    public function sanitize($input, $prev = [])
    {
        return [
            'site_key'      => sanitize_text_field($input['site_key'] ?? ''),
            'secret_key'    => sanitize_text_field($input['secret_key'] ?? ($prev['secret_key'] ?? '')),
            'error_message' => sanitize_text_field($input['error_message'] ?? ''),
        ];
    }

    // Hide stored secrets from the admin UI.
    public function maskSecrets($settings)
    {
        if (!empty($settings['secret_key'])) {
            $settings['secret_key'] = '__MASKED__';
        }
        return $settings;
    }

    public function isConfigured($settings)
    {
        return !empty($settings['site_key']) && !empty($settings['secret_key']);
    }

    public function render($settings)
    {
        // echo the widget markup + enqueue the provider script
    }

    public function verify($settings, $request)
    {
        // return true only on a confirmed-valid response — fail closed
    }

    public function validateCredentials($settings, $token)
    {
        // return ['valid' => bool, 'message' => string]
    }
}

add_filter('fluent_affiliate/captcha_providers', function ($providers) {
    $providers['turnstile'] = new My_Turnstile_Provider();
    return $providers;
});
```

`credentialFingerprint()` is inherited (an `md5` of the settings array) and powers the validate-before-save gate; override it if your provider needs a different notion of "the same keys".

## Related

- [Custom Registration Fields](/guides/custom-registration-fields)
- [Portal Customization](/guides/portal-customization)
- [Auth Filters](/hooks/filters/auth)
