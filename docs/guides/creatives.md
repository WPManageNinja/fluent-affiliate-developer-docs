---
title: Creatives (Pro)
description: Manage affiliate marketing creative assets — banners, images, text, and HTML — with scheduling, access control, and portal display.
---

# Creatives <span class="pro-badge">PRO</span>

Creatives are marketing assets (banner images, text links, HTML snippets) that affiliates can download or embed in their promotions. The Pro plugin adds a full creative management system with scheduling, group/affiliate targeting, and portal integration.

## Creative Types

| Type | Description |
|------|-------------|
| `image` | Image asset with a destination URL. |
| `text` | Plain text link. |
| `html` | Raw HTML embed code. |
| `banner` | Banner image with an overlay text option. |

## Data Model

Creatives are stored in the `fa_creatives` table (Pro migration). See the [Creative model](/database/models/creative) for the full column reference.

Key fields:

| Field | Description |
|-------|-------------|
| `name` | Creative label shown to admins and affiliates. |
| `type` | Creative type: `image`, `text`, `html`, `banner`. |
| `image` | URL of the image asset. |
| `text` | Text content for text-type creatives. |
| `url` | Destination URL (wraps image/banner links). |
| `privacy` | `public` (all affiliates) or `private` (targeted). |
| `affiliate_ids` | JSON array of affiliate IDs (private targeting). |
| `group_ids` | JSON array of group IDs (private targeting). |
| `status` | `active`, `inactive`, `scheduled`, `expired`. |
| `meta` | Serialized: `start_time`, `end_time`, `media_width`, `media_height`, `media_type`, `attachment_id`. |

## Scheduling

Creatives with `status = 'scheduled'` are automatically activated and expired by WordPress Action Scheduler jobs:

- **Activation:** `fluent_affiliate/activate_creative` fires at `meta.start_time`.
- **Expiry:** `fluent_affiliate/expire_creative` fires at `meta.end_time`.

When either job runs, the status transitions and `fluent_affiliate/creative_status_changed` fires.

```php
// React to any creative becoming active or expired
add_action('fluent_affiliate/creative_status_changed', function($creative, $newStatus) {
    if ($newStatus === 'active') {
        // Notify relevant affiliates
        my_plugin_notify_affiliates_creative_live($creative);
    }
}, 10, 2);
```

## Access Control (Privacy)

- `privacy = 'public'` — all affiliates see the creative in their portal.
- `privacy = 'private'` — only affiliates whose `id` is in `affiliate_ids` **or** whose `group_id` is in `group_ids` can see it.

## REST API

### Admin Endpoints

All require `manage_options`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/wp-json/fluent-affiliate/v2/settings/creatives` | List all creatives. |
| `POST` | `/wp-json/fluent-affiliate/v2/settings/creatives` | Create a new creative. |
| `GET` | `/wp-json/fluent-affiliate/v2/settings/creatives/{id}` | Get a single creative. |
| `PATCH` | `/wp-json/fluent-affiliate/v2/settings/creatives/{id}` | Update a creative. |
| `DELETE` | `/wp-json/fluent-affiliate/v2/settings/creatives/{id}` | Delete a creative. |

### Portal Endpoint

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/wp-json/fluent-affiliate/v2/portal/creatives` | Get creatives available to the authenticated affiliate. |

### Create a Scheduled Creative

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/creatives \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale Banner",
    "type": "image",
    "image": "https://yoursite.com/banners/summer-sale.png",
    "url": "https://yoursite.com/summer-sale/",
    "privacy": "public",
    "status": "scheduled",
    "meta": {
      "start_time": "2026-06-01 00:00:00",
      "end_time": "2026-06-30 23:59:59",
      "media_width": 728,
      "media_height": 90,
      "media_type": "image/png"
    }
  }'
```

## Action Hooks

### `fluent_affiliate/after_create_creative`

```php
add_action('fluent_affiliate/after_create_creative', function($creative) {
    my_cdn_warm_url($creative->image);
});
```

### `fluent_affiliate/creative_updated`

```php
add_action('fluent_affiliate/creative_updated', function($creative) {
    my_cdn_purge_url($creative->image);
});
```

### `fluent_affiliate/before_delete_creative`

```php
add_action('fluent_affiliate/before_delete_creative', function($creative) {
    my_plugin_archive_creative($creative->toArray());
});
```

### `fluent_affiliate/after_delete_creative`

```php
add_action('fluent_affiliate/after_delete_creative', function($creativeId) {
    delete_option('my_plugin_creative_cache_' . $creativeId);
});
```

### `fluent_affiliate/creative_status_changed`

```php
add_action('fluent_affiliate/creative_status_changed', function($creative, $newStatus) {
    // $newStatus is 'active' or 'expired'
}, 10, 2);
```

## Filter Hooks

### `fluent_affiliate/create_creative_data`

Modify data before a creative is created.

```php
add_filter('fluent_affiliate/create_creative_data', function($data) {
    // Enforce maximum image dimensions
    if ($data['type'] === 'image' && isset($data['meta']['media_width'])) {
        $data['meta']['media_width'] = min((int)$data['meta']['media_width'], 970);
    }
    return $data;
});
```

### `fluent_affiliate/update_creative_data`

Modify data before a creative is updated.

```php
add_filter('fluent_affiliate/update_creative_data', function($data, $creative) {
    return $data;
}, 10, 2);
```

## Programmatic Usage

```php
use FluentAffiliatePro\App\Models\Creative;

// Get all active public banners
$banners = Creative::ofStatus('active')
    ->ofType('image')
    ->publicCreatives()
    ->get();

// Get creatives visible to a specific affiliate
$affiliate = \FluentAffiliate\App\Models\Affiliate::find($affiliateId);

$creatives = Creative::ofStatus('active')
    ->where(function($q) use ($affiliate) {
        $q->where('privacy', 'public')
          ->orWhereJsonContains('affiliate_ids', $affiliate->id)
          ->orWhereJsonContains('group_ids', $affiliate->group_id);
    })
    ->get();
```
