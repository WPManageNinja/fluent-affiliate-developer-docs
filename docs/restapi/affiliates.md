---
title: Affiliates API
description: Affiliate listing, creation, updates, deletion, per-affiliate statistics and transactions, FluentCRM contact management, and lifetime-commission customer links.
---

# Affiliates API

Affiliate listing, creation, updates, deletion, per-affiliate statistics and transactions, FluentCRM contact management, and lifetime-commission customer links.

## Authentication

These routes are protected by `AffiliatePolicy`. Admin users have full access; affiliate-level users require the `read_all_affiliates` capability.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/affiliates` | Core | [List Affiliates](/restapi/operations/affiliates/list-affiliates) | `AffiliateController@index` |
| `GET` | `/affiliates/export` | Core | [Export Affiliates](/restapi/operations/affiliates/export-affiliates) | `AffiliateController@export` |
| `POST` | `/affiliates` | Core | [Create Affiliate](/restapi/operations/affiliates/create-affiliate) | `AffiliateController@createAffiliate` |
| `GET` | `/affiliates/{id}` | Core | [Get Affiliate](/restapi/operations/affiliates/get-affiliate) | `AffiliateController@getAffiliate` |
| `DELETE` | `/affiliates/{id}` | Core | [Delete Affiliate](/restapi/operations/affiliates/delete-affiliate) | `AffiliateController@deleteAffiliate` |
| `PATCH` | `/affiliates/{id}` | Core | [Update Affiliate](/restapi/operations/affiliates/update-affiliate) | `AffiliateController@updateAffiliate` |
| `PATCH` | `/affiliates/{id}/status` | Core | [Update Affiliate Status](/restapi/operations/affiliates/update-affiliate-status) | `AffiliateController@updateAffiliateStatus` |
| `GET` | `/affiliates/{id}/transactions` | Core | [List Affiliate Transactions](/restapi/operations/affiliates/list-affiliate-transactions) | `AffiliateController@getTransactions` |
| `GET` | `/affiliates/{id}/visits` | Core | [List Affiliate Visits](/restapi/operations/affiliates/list-affiliate-visits) | `AffiliateController@getVisits` |
| `GET` | `/affiliates/{id}/referrals` | Core | [List Affiliate Referrals](/restapi/operations/affiliates/list-affiliate-referrals) | `AffiliateController@getReferrals` |
| `GET` | `/affiliates/{id}/customers` | Core | [List Affiliate Customers](/restapi/operations/affiliates/list-affiliate-customers) | `AffiliateController@getCustomers` |
| `GET` | `/affiliates/{id}/stats` | Core | [Get Affiliate Stats](/restapi/operations/affiliates/get-affiliate-stats) | `AffiliateController@getOverviewStats` |
| `GET` | `/affiliates/{id}/statistics` | Core | [Get Affiliate Statistics](/restapi/operations/affiliates/get-affiliate-statistics) | `AffiliateController@statistics` |
| `GET` | `/affiliates/{id}/crm-contact` | Core | [Get Affiliate CRM Contact](/restapi/operations/affiliates/get-affiliate-crm-contact) | `AffiliateController@getCrmContact` |
| `GET` | `/affiliates/{id}/crm-options` | Core | [Get Affiliate CRM Options](/restapi/operations/affiliates/get-affiliate-crm-options) | `AffiliateController@getCrmOptions` |
| `POST` | `/affiliates/{id}/crm-contact/tags` | Core | [Update Affiliate CRM Tags](/restapi/operations/affiliates/update-affiliate-crm-tags) | `AffiliateController@updateCrmTags` |
| `POST` | `/affiliates/{id}/crm-contact/lists` | Core | [Update Affiliate CRM Lists](/restapi/operations/affiliates/update-affiliate-crm-lists) | `AffiliateController@updateCrmLists` |
| `GET` | `/affiliates/{id}/customers/search` | <span class="pro-badge">PRO</span> | [Search Affiliate Customers](/restapi/operations/affiliates/search-affiliate-customers) | `LifetimeCommissionController@searchCustomers` |
| `POST` | `/affiliates/{id}/customers/link` | <span class="pro-badge">PRO</span> | [Link Affiliate Customer](/restapi/operations/affiliates/link-affiliate-customer) | `LifetimeCommissionController@link` |
| `DELETE` | `/affiliates/{id}/customers/{customerId}` | <span class="pro-badge">PRO</span> | [Unlink Affiliate Customer](/restapi/operations/affiliates/unlink-affiliate-customer) | `LifetimeCommissionController@unlink` |

