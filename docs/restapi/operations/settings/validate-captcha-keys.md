---
title: Validate Captcha Keys
description: "Validate a provider's captcha site/secret key pair against the provider's API before saving."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/captcha/validate`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `ProSettingController@validateCaptchaKeys`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="validateCaptchaKeys" specUrl="/openapi/public/settings/validate-captcha-keys.json" />
