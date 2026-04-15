---
title: REST API Overview
description: Overview of the FluentAffiliate REST API — base URL, authentication, and resource index.
---

# REST API

All endpoints live under:

```
https://yoursite.com/wp-json/fluent-affiliate/v2/
```

## Authentication

### Nonce (browser / admin SPA)

From a browser context where the user is already logged in to WordPress, pass the REST nonce in the `X-WP-Nonce` header:

```bash
curl https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates \
  -H "X-WP-Nonce: abc123"
```

The built-in admin SPA injects the nonce as `window.fluentAffiliateAdmin.nonce` and sends it automatically.

### Application Passwords (server-to-server)

For external API clients, use [WordPress Application Passwords](https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/#application-passwords) with HTTP Basic Auth:

```bash
curl https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates \
  -H "Authorization: Basic $(echo -n 'admin:xxxx xxxx xxxx xxxx xxxx xxxx' | base64)"
```

## Method Override

The plugin's internal SPA sends `PUT`, `PATCH`, and `DELETE` requests as `POST` with an `X-HTTP-Method-Override` header to avoid server/proxy compatibility issues:

```bash
# Equivalent to PUT /affiliates/5
curl -X POST https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/5 \
  -H "X-HTTP-Method-Override: PUT" \
  -H "X-WP-Nonce: abc123" \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

External callers can use the actual HTTP verbs directly; the override header is not required.

## Response Format

All responses are plain JSON with no top-level wrapper. See [Getting Started → Response Envelope](/getting-started#response-envelope) for the full shape reference.

```json
// Success — list
{ "affiliates": [ ... ], "total": 142 }

// Success — single
{ "affiliate": { "id": 1, ... } }

// Error (default HTTP 422)
{ "message": "The selected group could not be found" }
```

## Core Resources

| Resource | Base Path | Required Permission |
|----------|-----------|---------------------|
| [Affiliates](/restapi/affiliates) | `/affiliates` | `read_all_affiliates` or `manage_all_affiliates` |
| [Referrals](/restapi/referrals) | `/referrals` | `read_all_referrals` or `manage_all_referrals` |
| [Payouts](/restapi/payouts) | `/payouts` | `read_all_payouts` or `manage_all_payouts` |
| [Visits](/restapi/visits) | `/visits` | `read_all_visits` |
| [Portal](/restapi/portal) | `/portal` | Any authenticated WordPress user |
| [Reports](/restapi/reports) | `/reports` | Any authenticated WordPress user |
| [Settings](/restapi/settings) | `/settings` | `manage_options` or `manage_all_data` |

WordPress administrators (`manage_options`) always pass all permission checks.

## Pro Resources

| Resource | Description | Required Permission |
|----------|-------------|---------------------|
| [Affiliate Groups <span class="pro-badge">PRO</span>](/restapi/groups) | Manage affiliate groups | `manage_options` |
| [Creatives <span class="pro-badge">PRO</span>](/restapi/creatives) | Manage creative assets | `manage_options` |
| [Connected Sites <span class="pro-badge">PRO</span>](/restapi/connected-sites) | Multi-domain tracking | `manage_options` |
| [License <span class="pro-badge">PRO</span>](/restapi/license) | License activation | `manage_options` |
