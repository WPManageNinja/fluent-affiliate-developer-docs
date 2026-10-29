---
title: Unlink Affiliate Customer
description: "Unlink a customer from an affiliate."
outline: false
aside: false
---
## Endpoint

- **Method:** `DELETE`
- **Path:** `/affiliates/{id}/customers/{customerId}`
- **Edition:** <span class="pro-badge">PRO</span>
- **Controller:** `LifetimeCommissionController@unlink`
- **Route source:** `fluent-affiliate-pro/app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="unlinkAffiliateCustomer" specUrl="/openapi/public/affiliates/unlink-affiliate-customer.json" />
