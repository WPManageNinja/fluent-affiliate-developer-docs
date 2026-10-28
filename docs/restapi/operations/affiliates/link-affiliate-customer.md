---
title: Link Affiliate Customer
description: "Link a customer to an affiliate for lifetime commissions."
outline: false
aside: false
---
## Endpoint

- **Method:** `POST`
- **Path:** `/affiliates/{id}/customers/link`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `LifetimeCommissionController@link`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="linkAffiliateCustomer" specUrl="/openapi/public/affiliates/link-affiliate-customer.json" />
