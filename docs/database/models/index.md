---
title: Models Overview
description: Index of all FluentAffiliate ORM model classes.
---

# Models Overview

FluentAffiliate uses an Eloquent-like ORM (WPFluent Framework). All models extend `FluentAffiliate\Framework\Database\Orm\Builder`.

| Model | Table | Description |
|-------|-------|-------------|
| [`Affiliate`](/database/models/affiliates) | `fa_affiliates` | Represents a registered affiliate. Central model in FluentAffiliate. |
| [`Referral`](/database/models/referrals) | `fa_referrals` | Represents a commission event generated when a referred visitor completes a qualifying action. |
| [`Payout`](/database/models/payouts) | `fa_payouts` | A payout batch grouping multiple affiliate transactions. |
| [`Transaction`](/database/models/payout-transactions) | `fa_payout_transactions` | An individual payout transaction for a single affiliate within a payout batch. |
| [`Visit`](/database/models/visits) | `fa_visits` | Tracks each click of an affiliate referral link. |
| [`Customer`](/database/models/customers) | `fa_customers` | A customer who made a purchase through an affiliate link. |
| [`Meta`](/database/models/meta) | `fa_meta` | Generic key-value meta storage for affiliate and other objects. |
| [`Creative`](/database/models/creatives) | `fa_creatives` | A marketing creative asset (banner, image, or text) managed in FluentAffiliate Pro. <span class="pro-badge">PRO</span> |
