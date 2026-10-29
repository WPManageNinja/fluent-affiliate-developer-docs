---
title: List Affiliate Transactions
description: "List payout transactions for an affiliate."
outline: false
aside: false
---
## Endpoint

- **Method:** `GET`
- **Path:** `/affiliates/{id}/transactions`
- **Edition:** Core
- **Controller:** `AffiliateController@getTransactions`
- **Route source:** `app/Http/Routes/api.php`
- **Access:** `AffiliatePolicy` — checked by `AffiliatePolicy::getTransactions()`.

<OAOperation operationId="listAffiliateTransactions" specUrl="/openapi/public/affiliates/list-affiliate-transactions.json" />
