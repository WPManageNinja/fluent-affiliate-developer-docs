---
title: Delete PayPal Settings
description: "Remove the PayPal keys. The registered webhooks are removed at PayPal first; the keys are removed even when PayPal cannot be reached."
outline: false
aside: false
---
## Endpoint

- **Method:** `DELETE`
- **Path:** `/settings/paypal-payouts`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalSettingsController@delete`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `SuperAdminPolicy` — WordPress administrators only (`manage_options`). Not delegable.

<OAOperation operationId="deletePaypalSettings" specUrl="/openapi/public/settings/delete-paypal-settings.json" />
