---
title: Test PayPal Connection
description: "Test the saved keys for a mode (`mode`: `test` or `live`) by requesting an access token from PayPal."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/paypal-payouts/test`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalSettingsController@test`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `SuperAdminPolicy` — WordPress administrators only (`manage_options`). Not delegable.

<OAOperation operationId="testPaypalConnection" specUrl="/openapi/public/settings/test-paypal-connection.json" />
