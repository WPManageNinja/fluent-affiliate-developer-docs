---
title: REST API Overview
description: Source-verified overview for the FluentAffiliate REST API.
---

# FluentAffiliate REST API

This reference covers 94 routes registered in the FluentAffiliate core and Pro route files.

## Base URL

`https://your-site.com/wp-json/fluent-affiliate/v2`

## Authentication

- **Admin and settings routes:** use WordPress Application Passwords (`username:application_password` via Basic auth) or a WordPress nonce in the `X-WP-Nonce` header.
- **Portal routes:** browser clients use cookie authentication with an `X-WP-Nonce` header; server-to-server integrations can use Application Passwords.
- **Method override:** the FluentAffiliate frontend sends PUT, PATCH, and DELETE requests as POST requests with an `X-HTTP-Method-Override` header.

## URL Structure

All routes share the single base path `/wp-json/fluent-affiliate/v2`. There is no separate Pro URL prefix — Pro modules (Groups, Creatives, Connected Sites, License) register their routes under the `/settings/` segment alongside core settings routes.

| Pro module | URL prefix |
| --- | --- |
| Groups | `/settings/groups/…` |
| Creatives | `/settings/creatives/…` |
| Connected Sites | `/settings/connected-sites-config/…` |
| License | `/settings/license` |

## Modules

| Module | Edition | Route Count | Description |
| --- | --- | --- | --- |
| [Affiliates API](/restapi/affiliates) | Core | 12 | Affiliate listing, creation, updates, deletion, and per-affiliate statistics and transactions. |
| [Referrals API](/restapi/referrals) | Core | 6 | Referral listing, manual creation, updates, deletion, and CSV export. |
| [Payouts API](/restapi/payouts) | Core | 11 | Payout batch management, transaction operations, payout processing, and CSV export. |
| [Visits API](/restapi/visits) | Core | 2 | Affiliate visit tracking records — listing and CSV export. |
| [Portal API](/restapi/portal) | Core | 6 | Affiliate portal data — stats, referrals, transactions, visits, and settings for the currently authenticated affiliate. |
| [Reports API](/restapi/reports) | Core | 4 | Dashboard statistics, chart data, advanced commerce reports, and report provider listing. |
| [Settings API](/restapi/settings) | Core | 31 | Email configuration, feature settings, integrations, referral config, page management, migrations, and registration fields. |
| [Affiliate Groups API](/restapi/groups) | <span class="pro-badge">PRO</span> | 8 | Affiliate group CRUD operations, member listing, overview stats, and group statistics. |
| [Creatives API](/restapi/creatives) | <span class="pro-badge">PRO</span> | 6 | Creative asset management (admin) and portal creative retrieval for authenticated affiliates. |
| [Connected Sites API](/restapi/connected-sites) | <span class="pro-badge">PRO</span> | 5 | Connected site configuration management, token issuance, and site disconnect operations. |
| [License API](/restapi/license) | <span class="pro-badge">PRO</span> | 3 | Pro license status retrieval, activation, and deactivation. |

