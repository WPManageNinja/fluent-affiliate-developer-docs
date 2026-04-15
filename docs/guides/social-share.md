---
title: Social Media Share (Pro)
description: Configure the social media sharing widget in the affiliate portal — platforms, icons, URL templates, and developer hooks.
---

# Social Media Share <span class="pro-badge">PRO</span>

The Social Media Share feature adds a sharing widget to the affiliate portal, allowing affiliates to post their referral link directly to social networks.

## Supported Platforms

Eight platforms are built in:

| Key | Platform | Share URL Template |
|-----|----------|--------------------|
| `twitter` | Twitter / X | `https://twitter.com/intent/tweet?text={title}%20{url}` |
| `facebook` | Facebook | `https://www.facebook.com/sharer/sharer.php?u={url}` |
| `linkedin` | LinkedIn | `https://www.linkedin.com/sharing/share-offsite/?url={url}` |
| `whatsapp` | WhatsApp | `https://api.whatsapp.com/send?text={title}%20{url}` |
| `email` | Email | `mailto:?subject={title}&body={url}` |
| `reddit` | Reddit | `https://www.reddit.com/submit?url={url}&title={title}` |
| `telegram` | Telegram | `https://t.me/share/url?url={url}&text={title}` |
| `pinterest` | Pinterest | `https://pinterest.com/pin/create/button/?url={url}&description={title}` |

`{url}` is replaced with the affiliate's referral URL; `{title}` with the site title.

## Default Enabled Platforms

Unless an admin has saved custom settings, these platforms are enabled by default:

- `facebook`
- `twitter`
- `linkedin`
- `whatsapp`
- `email`

## Enabling / Configuring

The feature is managed under **Settings → Features → Social Media Share** in the FluentAffiliate admin. Admins can enable/disable individual platforms and reorder them.

## Feature Key

The feature is registered under the key `social_media_share`. This key is used in the settings API and filter hooks.

## REST API

Settings are managed via the features API:

```bash
# Get current social share settings
GET /wp-json/fluent-affiliate/v2/settings/features/social_media_share

# Update settings
POST /wp-json/fluent-affiliate/v2/settings/features/social_media_share
```

Example request body:

```json
{
  "enabled_keys": ["twitter", "facebook", "email", "whatsapp"],
  "status": "yes"
}
```

## Filter Hooks

### `fluent_affiliate/social_media_links`

Add, remove, or modify platform definitions.

```php
add_filter('fluent_affiliate/social_media_links', function($links) {
    // Add Mastodon
    $links['mastodon'] = [
        'key'       => 'mastodon',
        'title'     => 'Mastodon',
        'icon'      => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>',
        'share_url' => 'https://mastodon.social/share?text={title}%20{url}',
        'status'    => 'yes',
    ];

    // Remove Pinterest
    unset($links['pinterest']);

    return $links;
});
```

### `fluent_affiliate/social_media_share_default_enabled_keys`

Change which platforms are enabled when no custom configuration has been saved.

```php
add_filter('fluent_affiliate/social_media_share_default_enabled_keys', function($keys) {
    // Only Twitter and email enabled by default
    return ['twitter', 'email'];
});
```

## Portal Data

The portal SPA receives the enabled social platforms via the `portal_localize_data` filter. The `SocialMediaShareHandler` injects a `social_links` key containing only the enabled platforms:

```php
add_filter('fluent_affiliate/portal_localize_data', function($portalData) {
    // $portalData['social_links'] is already set by Pro (array of enabled platforms)
    // You can modify it here if needed
    return $portalData;
});
```

## Feature Settings Hook

You can extend the settings returned/saved for this feature:

```php
// Extend GET response
add_filter('fluent_affiliate/get_feature_settings_social_media_share', function($response, $savedData) {
    $response['custom_message'] = get_option('my_plugin_social_message', '');
    return $response;
}, 10, 2);

// Extend save handler
add_action('fluent_affiliate/update_feature_settings_social_media_share', function($data) {
    if (!empty($data['custom_message'])) {
        update_option('my_plugin_social_message', sanitize_textarea_field($data['custom_message']));
    }
});
```
