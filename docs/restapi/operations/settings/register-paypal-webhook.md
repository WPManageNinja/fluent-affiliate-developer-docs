---
title: Register PayPal Webhook
description: "Register the webhook at PayPal for a mode (`mode`: `test` or `live`) and save its ID. Without a webhook, payout results arrive with the hourly check."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/paypal-payouts/webhook`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalSettingsController@registerWebhook`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `SuperAdminPolicy` — WordPress administrators only (`manage_options`). Not delegable.

<OAOperation operationId="registerPaypalWebhook" specUrl="/openapi/public/settings/register-paypal-webhook.json" />
