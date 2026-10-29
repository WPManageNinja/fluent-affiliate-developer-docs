---
title: Payouts API
description: Payout batch management, transaction operations, payout processing, and CSV export.
---

# Payouts API

Payout batch management, transaction operations, payout processing, and CSV export.

## Authentication

Payout routes are protected by `PayoutPolicy`. Admin users have full access; affiliate-level users require `read_all_payouts`.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/payouts` | Core | [List Payouts](/restapi/operations/payouts/list-payouts) | `PayoutController@index` |
| `POST` | `/payouts/validate-payout-config` | Core | [Validate Payout Config](/restapi/operations/payouts/validate-payout-config) | `PayoutController@validatePayoutConfig` |
| `POST` | `/payouts/process-payout` | Core | [Process Payout](/restapi/operations/payouts/process-payout) | `PayoutController@processPayout` |
| `GET` | `/payouts/{id}` | Core | [Get Payout](/restapi/operations/payouts/get-payout) | `PayoutController@show` |
| `GET` | `/payouts/{id}/referrals` | Core | [List Payout Referrals](/restapi/operations/payouts/list-payout-referrals) | `PayoutController@getReferrals` |
| `GET` | `/payouts/{id}/transactions` | Core | [List Payout Transactions](/restapi/operations/payouts/list-payout-transactions) | `PayoutController@getTransactions` |
| `GET` | `/payouts/{id}/transactions-export` | Core | [Export Payout Transactions](/restapi/operations/payouts/export-payout-transactions) | `PayoutController@getExportableTransactions` |
| `DELETE` | `/payouts/{id}/transactions/{transaction_id}` | Core | [Delete Payout Transaction](/restapi/operations/payouts/delete-payout-transaction) | `PayoutController@deleteTransaction` |
| `PATCH` | `/payouts/{id}/transactions/{transaction_id}` | Core | [Update Payout Transaction](/restapi/operations/payouts/update-payout-transaction) | `PayoutController@patchTransaction` |
| `PATCH` | `/payouts/{id}/transactions/bulk-action` | Core | [Bulk Update Payout Transactions](/restapi/operations/payouts/bulk-update-payout-transactions) | `PayoutController@bulkPatchTransactions` |
| `PATCH` | `/payouts/{id}` | Core | [Update Payout](/restapi/operations/payouts/update-payout) | `PayoutController@updatePayout` |
| `POST` | `/payouts/{id}/paypal-send` | <span class="pro-badge">PRO</span> | [Send PayPal Payout](/restapi/operations/payouts/send-paypal-payout) | `PayPalPayoutController@sendPayout` |
| `POST` | `/payouts/{id}/paypal-sync` | <span class="pro-badge">PRO</span> | [Sync PayPal Payout](/restapi/operations/payouts/sync-paypal-payout) | `PayPalPayoutController@syncPayout` |
| `POST` | `/payouts/{id}/paypal-batch` | <span class="pro-badge">PRO</span> | [Recover PayPal Batch](/restapi/operations/payouts/recover-paypal-batch) | `PayPalPayoutController@recoverBatch` |
| `POST` | `/payouts/{id}/paypal-not-sent` | <span class="pro-badge">PRO</span> | [Mark PayPal Payout Not Sent](/restapi/operations/payouts/mark-paypal-payout-not-sent) | `PayPalPayoutController@markNotSent` |

