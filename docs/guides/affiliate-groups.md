---
title: Affiliate Groups (Pro)
description: Use affiliate groups to apply custom commission rates, filter creatives, and segment reporting for sets of affiliates.
---

# Affiliate Groups <span class="pro-badge">PRO</span>

Affiliate groups let you segment affiliates and apply group-level commission overrides. When an affiliate belongs to a group, the group's commission rate is used unless the affiliate has their own individual override.

## How Groups Are Stored

Groups are **not** stored in a dedicated table. They use the `fa_meta` table with `object_type = 'affiliate_group'`:

| Column | Value |
|--------|-------|
| `object_type` | `affiliate_group` |
| `object_id` | `0` (not linked to a parent object) |
| `meta_key` | Group name (e.g. `"Premium Partners"`) |
| `value` | Serialised JSON with commission settings |

The `value` JSON contains:

```json
{
  "rate_type": "percentage",
  "rate": 20,
  "status": "active",
  "notes": "Top-performing affiliates"
}
```

See the [AffiliateGroup model](/database/models/affiliate-group) for full details.

## Commission Hierarchy

Commission is resolved in this order:

1. **Affiliate override** — the affiliate's own `rate`/`rate_type` (if set individually).
2. **Group rate** — the group's `rate`/`rate_type` (if `rate_type` is not `default`).
3. **Global defaults** — the referral program settings.

## REST API

All group endpoints require `manage_options` (WordPress administrator).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/wp-json/fluent-affiliate/v2/settings/groups` | List all groups. |
| `POST` | `/wp-json/fluent-affiliate/v2/settings/groups` | Create a new group. |
| `GET` | `/wp-json/fluent-affiliate/v2/settings/groups/{id}` | Get a single group. |
| `PATCH` | `/wp-json/fluent-affiliate/v2/settings/groups/{id}` | Update a group. |
| `DELETE` | `/wp-json/fluent-affiliate/v2/settings/groups/{id}` | Delete a group. |
| `GET` | `/wp-json/fluent-affiliate/v2/settings/groups/{id}/affiliates` | List affiliates in the group. |
| `GET` | `/wp-json/fluent-affiliate/v2/settings/groups/{id}/overview` | Summary stats. |
| `GET` | `/wp-json/fluent-affiliate/v2/settings/groups/{id}/statistics` | Chart data. |

### Create a Group

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/groups \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{
    "meta_key": "VIP Partners",
    "rate_type": "percentage",
    "rate": 25,
    "status": "active",
    "notes": "Affiliates with 100+ referrals"
  }'
```

### Assign an Affiliate to a Group

Update the affiliate's `group_id` field via the Affiliates API:

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/affiliates/42 \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{ "group_id": 7 }'
```

## Action Hooks

### `fluent_affiliate/before_create_affiliate_group`

Fires immediately before a group is saved.

```php
add_action('fluent_affiliate/before_create_affiliate_group', function($data) {
    // $data = ['meta_key' => 'Group Name', 'rate_type' => 'percentage', 'rate' => 20, ...]
    error_log('Creating group: ' . $data['meta_key']);
});
```

### `fluent_affiliate/after_create_affiliate_group`

Fires after a group is successfully created.

```php
add_action('fluent_affiliate/after_create_affiliate_group', function($group) {
    my_crm_sync_group($group->id, $group->meta_key);
});
```

### `fluent_affiliate/before_delete_affiliate_group`

Fires before a group is deleted. Use this to migrate affiliates.

```php
add_action('fluent_affiliate/before_delete_affiliate_group', function($group) {
    // Move affiliates to a different group before deletion
    \FluentAffiliate\App\Models\Affiliate::where('group_id', $group->id)
        ->update(['group_id' => 0]);
});
```

### `fluent_affiliate/after_delete_affiliate_group`

Fires after a group is deleted.

```php
add_action('fluent_affiliate/after_delete_affiliate_group', function($groupId) {
    delete_option('my_plugin_group_' . $groupId . '_cache');
});
```

## Filter Hooks

### `fluent_affiliate/create_affiliate_group_data_value`

Modify the serialised value before a group is created.

```php
add_filter('fluent_affiliate/create_affiliate_group_data_value', function($value, $data) {
    // Add a custom field to every new group
    $value['custom_tier'] = sanitize_text_field($data['custom_tier'] ?? 'standard');
    return $value;
}, 10, 2);
```

### `fluent_affiliate/update_affiliate_group_data_value`

Modify the serialised value before a group is updated.

```php
add_filter('fluent_affiliate/update_affiliate_group_data_value', function($value, $group, $data) {
    return $value;
}, 10, 3);
```

## Programmatic Usage

```php
use FluentAffiliate\App\Models\AffiliateGroup;
use FluentAffiliate\App\Models\Affiliate;

// Get all active groups
$groups = AffiliateGroup::all()->filter(function($g) {
    $v = maybe_unserialize($g->value);
    return ($v['status'] ?? '') === 'active';
});

// Get affiliates in a group
$group      = AffiliateGroup::find($groupId);
$affiliates = $group->affiliates()->ofStatus('active')->get();

// Move an affiliate to a group
Affiliate::where('id', $affiliateId)->update(['group_id' => $group->id]);
```

## Recurring Commissions Per Group

When Recurring Commissions (Pro) is enabled, group-level recurring rates can be configured separately. See [Recurring Commissions](/guides/recurring-commissions) for details.
