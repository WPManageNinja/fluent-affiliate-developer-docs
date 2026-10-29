---
title: List Portal Transactions
description: "Get the authenticated affiliate's payout transactions."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/portal/transactions`
- **Edition:** Core
- **Controller:** `PortalController@getTransactions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `UserPolicy` — A logged-in WordPress user with an `active` affiliate account. Pending and inactive affiliates are rejected.

<OAOperation operationId="listPortalTransactions" specUrl="/openapi/public/portal/list-portal-transactions.json" />
