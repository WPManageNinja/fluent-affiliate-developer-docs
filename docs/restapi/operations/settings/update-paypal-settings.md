---
title: Update PayPal Settings
description: "Save the PayPal Payouts settings (`settings.mode` and the `test_*` / `live_*` client ID and secret). Changed key pairs are checked with PayPal before anything is saved. A webhook is registered for each configured mode that does not have one; problems are returned in `notices`. Send the masked secret back unchanged to keep the stored secret."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/settings/paypal-payouts`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `PayPalSettingsController@save`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `SuperAdminPolicy` — WordPress administrators only (`manage_options`). Not delegable.

<OAOperation operationId="updatePaypalSettings" specUrl="/openapi/public/settings/update-paypal-settings.json" />
