---
title: REST API Overview
description: Source-verified overview for the FluentAffiliate REST API.
---

# FluentAffiliate REST API

## Base URL

`https://your-site.com/wp-json/fluent-affiliate/v2`

## Authentication

- **Admin and settings routes:** typically used with WordPress Application Passwords.
- **Portal routes:** typically use cookie authentication plus a nonce in browser contexts.
- **Method override:** the FluentAffiliate frontend sends PUT, PATCH, and DELETE requests as POST requests with `X-HTTP-Method-Override`.

## Resources

| Resource | Edition | Routes | Description |
| --- | --- | --- | --- |
| [Affiliates](/restapi/affiliates) | Core | 12 | Affiliate listing, creation, updates, status changes, and per-affiliate stats. |
| [Referrals](/restapi/referrals) | Core | 6 | Referral listing, creation, updates, and status management. |
| [Payouts](/restapi/payouts) | Core | 11 | Payout batch creation, processing, status updates, and transaction history. |
| [Visits](/restapi/visits) | Core | 2 | Click/visit log listing and retrieval. |
| [Portal](/restapi/portal) | Core | 6 | Affiliate-facing portal endpoints for dashboard data, links, and account settings. |
| [Reports](/restapi/reports) | Core | 4 | Summary and trend reports for admins. |
| [Settings](/restapi/settings) | Core | 31 | Full plugin settings surface — general, commission, integrations, email, and more. |
| [Affiliate Groups](/restapi/groups) | <span class="pro-badge">PRO</span> | 8 | Group creation, listing, updates, and deletion. |
| [Creatives](/restapi/creatives) | <span class="pro-badge">PRO</span> | 6 | Creative asset management — banners, text links, and email swipes. |
| [Connected Sites](/restapi/connected-sites) | <span class="pro-badge">PRO</span> | 5 | Multi-domain tracking site registration and management. |
| [License](/restapi/license) | <span class="pro-badge">PRO</span> | 3 | Pro license activation, deactivation, and status. |
