---
title: Connected Sites / Multi-Domain (Pro)
description: Track affiliate referrals across multiple WordPress sites using token-based cross-site authentication.
---

# Connected Sites / Multi-Domain <span class="pro-badge">PRO</span>

The Connected Sites feature lets a single FluentAffiliate Pro installation track affiliate traffic across **multiple WordPress sites**. Affiliates get one dashboard with unified stats, and referrals from any connected site flow back to the primary installation.

## Architecture

- One site is the **primary** (where FluentAffiliate Pro is installed and affiliates log in).
- Additional sites are **connected** via a shared token. They forward tracking parameters to the primary.
- Each connected site gets a unique `site_id` and `server_token` pair.

## Site Configuration Storage

Configuration is stored in a single WordPress option on the primary site:

| Option Key | Description |
|------------|-------------|
| `_connected_sites_config` | JSON object with `status` and `sites` array. |

Structure:

```json
{
  "status": "yes",
  "sites": [
    {
      "site_id": "841920",
      "site_url": "https://store2.example.com",
      "site_title": "Store 2",
      "server_token": "aBcDeF123456",
      "param_key": "ref",
      "cookie_duration": 30,
      "credit_last_referrer": "no",
      "status": "active",
      "logo": "",
      "description": "",
      "subtitle": ""
    }
  ]
}
```

## REST API

All endpoints require `manage_options`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/wp-json/fluent-affiliate/v2/settings/connected-sites-config` | Get the full connected-sites config. |
| `PATCH` | `/wp-json/fluent-affiliate/v2/settings/connected-sites-config` | Enable or disable multi-site. |
| `PATCH` | `/wp-json/fluent-affiliate/v2/settings/connected-sites-config/update` | Update a single connected site. |
| `POST` | `/wp-json/fluent-affiliate/v2/settings/connected-sites-config/issue` | Validate a URL and issue a token for a new site. |
| `POST` | `/wp-json/fluent-affiliate/v2/settings/connected-sites-config/disconnect` | Remove a connected site. |

### Connect a New Site

```bash
# Issue a token for a new site
curl -X POST \
  https://primary.example.com/wp-json/fluent-affiliate/v2/settings/connected-sites-config/issue \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{ "site_url": "https://store2.example.com" }'
```

Response:

```json
{
  "site_id": "841920",
  "server_token": "aBcDeF123456",
  "param_key": "ref",
  "cookie_duration": 30,
  "primary_url": "https://primary.example.com"
}
```

Save the `server_token` — it is only returned once.

### Disconnect a Site

```bash
curl -X POST \
  https://primary.example.com/wp-json/fluent-affiliate/v2/settings/connected-sites-config/disconnect \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{ "site_id": "841920" }'
```

## Site Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `site_id` | `string` | Unique 6-digit identifier. |
| `site_url` | `string` | The connected site's root URL. |
| `site_title` | `string` | Display name in the primary admin UI. |
| `server_token` | `string` | 12-character authentication token. |
| `param_key` | `string` | URL parameter used for referral tracking (e.g. `ref`). |
| `cookie_duration` | `int` | Cookie lifetime in days. |
| `credit_last_referrer` | `string` | `yes`/`no` — whether the last click wins. |
| `status` | `string` | `active` or `inactive`. |
| `logo` | `string` | Site logo URL for the admin UI. |
| `description` | `string` | Internal description. |
| `subtitle` | `string` | Subtitle shown in the affiliate portal share widget. |

## Filter Hooks

### `fluent_affiliate/portal/additional_sites`

Add or modify the list of connected sites shown in the affiliate portal's share widget:

```php
add_filter('fluent_affiliate/portal/additional_sites', function($sites) {
    // $sites is an array of ['name', 'url', 'param'] entries
    $sites[] = [
        'name'  => 'My Partner Store',
        'url'   => 'https://partner.example.com/',
        'param' => 'ref',
    ];
    return $sites;
});
```

## `MultiDomainHelper` Class

The `MultiDomainHelper` service class manages the config option:

```php
use FluentAffiliatePro\App\Services\MultiDomainHelper;

$helper = new MultiDomainHelper();

// Get full config
$config = $helper->getConfig();

// Validate a token for a site ID (used in cross-site authentication)
$site = $helper->getSite($siteId, $serverToken);
if (!$site) {
    // Token invalid — reject the request
}
```

## Security Notes

- Tokens are **12 random characters** — treat them as API keys. Do not expose them publicly.
- `getSite($siteId, $token)` validates the token match. Mismatches return `null`.
- Token rotation: issue a new token (reconnect the site) if a token is compromised.
