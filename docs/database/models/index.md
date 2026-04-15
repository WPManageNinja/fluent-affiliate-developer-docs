---
title: Models Overview
description: Index of all FluentAffiliate ORM model classes.
---

# Models Overview

FluentAffiliate uses an Eloquent-like ORM (WPFluent Framework). All models extend `FluentAffiliate\Framework\Database\Orm\Builder`.

| Model | Table | Description |
|-------|-------|-------------|
| [`Affiliate`](/database/models/affiliate) | `fa_affiliates` | Represents a registered affiliate. Central model in FluentAffiliate. |
| [`Referral`](/database/models/referral) | `fa_referrals` | Represents a commission event generated when a referred visitor completes a qualifying action. |
| [`Payout`](/database/models/payout) | `fa_payouts` | A payout batch grouping multiple affiliate transactions. |
| [`Transaction`](/database/models/transaction) | `fa_payout_transactions` | An individual payout transaction for a single affiliate within a payout batch. |
| [`Visit`](/database/models/visit) | `fa_visits` | Tracks each click of an affiliate referral link. |
| [`Customer`](/database/models/customer) | `fa_customers` | A customer who made a purchase through an affiliate link. |
| [`Meta`](/database/models/meta) | `fa_meta` | Generic key-value meta storage for affiliate and other objects. |
| [`Creative`](/database/models/creative) | `fa_creatives` | A marketing creative asset (banner, image, or text) managed in FluentAffiliate Pro. <span class="pro-badge">PRO</span> |
