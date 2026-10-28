---
title: Get Portal Bootstrap
description: "Get the data the affiliate portal app boots with: site info and the affiliate's share link parameters, additional sites, translated strings, the user, branded coupons, currency, menu items, QR code settings and date format. Only for an `active` affiliate. Filtered by `fluent_affiliate/portal_localize_data`."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/bootstrap`
- **Edition:** Core
- **Controller:** `PortalController@getBootstrap`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — Any logged-in WordPress user. The controller then checks the user's own affiliate account.

<OAOperation operationId="getPortalBootstrap" specUrl="/openapi/public/portal/get-portal-bootstrap.json" />
