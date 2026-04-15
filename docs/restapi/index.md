---
title: REST API Overview
description: Overview of the FluentAffiliate REST API.
---

# REST API

All endpoints live under:

```
https://yoursite.com/wp-json/fluent-affiliate/v2/
```

## Authentication

Use a **WordPress nonce** (issued via `wp_create_nonce('wp_rest')`) in the `X-WP-Nonce` header. For server-to-server requests, [Application Passwords](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/#application-passwords) are also supported.

```bash
curl https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates \
  -H "X-WP-Nonce: abc123"
```

## Core Resources

| Resource | Base Path | Auth |
|----------|-----------|------|
| [Affiliates](/restapi/affiliates) | `/affiliates` | Admin or affiliate with `fa_view_affiliates` capability |
| [Referrals](/restapi/referrals) | `/referrals` | Admin or affiliate with `fa_view_referrals` capability |
| [Payouts](/restapi/payouts) | `/payouts` | Admin or affiliate with `fa_view_payouts` capability |
| [Visits](/restapi/visits) | `/visits` | Admin or affiliate with `fa_view_visits` capability |
| [Portal](/restapi/portal) | `/portal` | Any authenticated WordPress user |
| [Reports](/restapi/reports) | `/reports` | Any authenticated WordPress user |
| [Settings](/restapi/settings) | `/settings` | WordPress administrator (`manage_options`) |

## Pro Resources

| Resource | Description | Auth |
|----------|-------------|------|
| [Affiliate Groups <span class="pro-badge">PRO</span>](/restapi/groups) | Requires FluentAffiliate Pro. | WordPress administrator (`manage_options`) |
| [Creatives <span class="pro-badge">PRO</span>](/restapi/creatives) | Requires FluentAffiliate Pro. | WordPress administrator (`manage_options`) |
| [Connected Sites <span class="pro-badge">PRO</span>](/restapi/connected-sites) | Requires FluentAffiliate Pro. | WordPress administrator (`manage_options`) |
| [License <span class="pro-badge">PRO</span>](/restapi/license) | Requires FluentAffiliate Pro. | WordPress administrator (`manage_options`) |

