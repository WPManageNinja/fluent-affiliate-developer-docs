---
title: Get PayPal Settings
description: "Get the PayPal Payouts settings and the webhook URL to register at PayPal. Client secrets are returned masked."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/paypal-payouts`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalSettingsController@get`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `SuperAdminPolicy` — WordPress administrators only (`manage_options`). Not delegable.

<OAOperation operationId="getPaypalSettings" specUrl="/openapi/public/settings/get-paypal-settings.json" />
