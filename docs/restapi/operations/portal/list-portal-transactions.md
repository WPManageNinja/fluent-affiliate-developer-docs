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
- **Access:** `UserPolicy` — Any logged-in WordPress user. The controller then checks the user's own affiliate account.

<OAOperation operationId="listPortalTransactions" specUrl="/openapi/public/portal/list-portal-transactions.json" />
