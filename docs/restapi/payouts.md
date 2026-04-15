---
title: Payouts API
description: REST API endpoints for Payouts.
---

# Payouts

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/payouts` | List payouts. |
| `POST` | `/payouts/validate-payout-config` | Validate a payout configuration before processing. |
| `POST` | `/payouts/process-payout` | Process a payout batch. |
| `GET` | `/payouts/{id}` | Retrieve a single payout. |
| `GET` | `/payouts/{id}/referrals` | List referrals included in a payout. |
| `GET` | `/payouts/{id}/transactions` | List transactions in a payout. |
| `GET` | `/payouts/{id}/transactions-export` | Export payout transactions as CSV. |
| `DELETE` | `/payouts/{id}/transactions/{transaction_id}` | Delete a payout transaction. |
| `PATCH` | `/payouts/{id}/transactions/{transaction_id}` | Update a payout transaction. |
| `PATCH` | `/payouts/{id}/transactions/bulk-action` | Bulk update payout transactions. |
| `PATCH` | `/payouts/{id}` | Update a payout. |

## `GET /payouts`

List payouts.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /payouts/validate-payout-config`

Validate a payout configuration before processing.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::validatePayoutConfig`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/validate-payout-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /payouts/process-payout`

Process a payout batch.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::processPayout`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/process-payout \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /payouts/{id}`

Retrieve a single payout.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::show`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /payouts/{id}/referrals`

List referrals included in a payout.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::getReferrals`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1/referrals \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /payouts/{id}/transactions`

List transactions in a payout.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::getTransactions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1/transactions \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /payouts/{id}/transactions-export`

Export payout transactions as CSV.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::getExportableTransactions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1/transactions-export \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /payouts/{id}/transactions/{transaction_id}`

Delete a payout transaction.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::deleteTransaction`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1/transactions/VALUE \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /payouts/{id}/transactions/{transaction_id}`

Update a payout transaction.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::patchTransaction`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1/transactions/VALUE \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /payouts/{id}/transactions/bulk-action`

Bulk update payout transactions.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::bulkPatchTransactions`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1/transactions/bulk-action \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /payouts/{id}`

Update a payout.

**Auth:** Admin or affiliate with `fa_view_payouts` capability  
**Controller:** `PayoutController::updatePayout`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/payouts/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

