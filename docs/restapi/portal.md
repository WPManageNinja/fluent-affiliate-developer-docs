---
title: Portal API
description: Affiliate portal data — stats, referrals, transactions, visits, and settings for the currently authenticated affiliate.
---

# Portal API

Affiliate portal data — stats, referrals, transactions, visits, and settings for the currently authenticated affiliate.

## Authentication

Portal routes use `UserPolicy` and always return data scoped to the currently authenticated affiliate.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/portal/stats` | Core | [Get Portal Stats](/restapi/operations/portal/get-portal-stats) | `PortalController@getStats` |
| `GET` | `/portal/referrals` | Core | [List Portal Referrals](/restapi/operations/portal/list-portal-referrals) | `PortalController@getReferrals` |
| `GET` | `/portal/transactions` | Core | [List Portal Transactions](/restapi/operations/portal/list-portal-transactions) | `PortalController@getTransactions` |
| `GET` | `/portal/visits` | Core | [List Portal Visits](/restapi/operations/portal/list-portal-visits) | `PortalController@getVisits` |
| `GET` | `/portal/settings` | Core | [Get Portal Settings](/restapi/operations/portal/get-portal-settings) | `PortalController@getSettings` |
| `POST` | `/portal/settings` | Core | [Update Portal Settings](/restapi/operations/portal/update-portal-settings) | `PortalController@updateSettings` |

