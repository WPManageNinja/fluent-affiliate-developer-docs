---
title: Get Integration Product Options
description: "Get product/category options for an integration."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/settings/integration/product_cat_options`
- **Edition:** Core
- **Controller:** `IntegrationController@getCustomAffiliateOptions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AdminPolicy` — `manage_options` or the `manage_all_data` permission.

<OAOperation operationId="getIntegrationProductOptions" specUrl="/openapi/public/settings/get-integration-product-options.json" />
