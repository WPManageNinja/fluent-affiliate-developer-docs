---
title: Referrals API
description: Referral listing, manual creation, updates, deletion, and CSV export.
---

# Referrals API

Referral listing, manual creation, updates, deletion, and CSV export.

## Authentication

Referral routes are protected by `ReferralPolicy`. Admin users have full access; affiliate-level users require `read_all_referrals`.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/referrals` | Core | [List Referrals](/restapi/operations/referrals/list-referrals) | `ReferralController@index` |
| `GET` | `/referrals/export` | Core | [Export Referrals](/restapi/operations/referrals/export-referrals) | `ReferralController@export` |
| `POST` | `/referrals` | Core | [Create Referral](/restapi/operations/referrals/create-referral) | `ReferralController@createReferral` |
| `GET` | `/referrals/{id}` | Core | [Get Referral](/restapi/operations/referrals/get-referral) | `ReferralController@show` |
| `PATCH` | `/referrals/{id}` | Core | [Update Referral](/restapi/operations/referrals/update-referral) | `ReferralController@update` |
| `DELETE` | `/referrals/{id}` | Core | [Delete Referral](/restapi/operations/referrals/delete-referral) | `ReferralController@destroy` |

