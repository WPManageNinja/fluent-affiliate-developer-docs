---
title: Permission Manager (Pro)
description: Grant non-admin WordPress users granular access to FluentAffiliate data sections using the Permission Manager.
---

# Permission Manager <span class="pro-badge">PRO</span>

The Permission Manager lets you delegate specific parts of the FluentAffiliate admin to non-administrator WordPress users — for example, a reporting assistant who can view referrals but not create payouts.

## Available Permissions

| Permission Key | Description |
|----------------|-------------|
| `read_all_affiliates` | View the full affiliates list and individual affiliate profiles. |
| `manage_all_affiliates` | Create, update, and delete affiliates. Supersedes `read_all_affiliates`. |
| `read_all_referrals` | View all referrals and referral details. |
| `manage_all_referrals` | Create, update, and delete referrals. Supersedes `read_all_referrals`. |
| `read_all_visits` | View all affiliate visit/click data. |
| `read_all_payouts` | View all payout batches and transactions. |
| `manage_all_payouts` | Create and process payouts. Supersedes `read_all_payouts`. |
| `manage_all_data` | **Super-permission** — supersedes all of the above. |

> `manage_all_data` is equivalent to full admin access to all FluentAffiliate data. Assign it carefully.

## Permission Hierarchy

```
manage_all_data
├── manage_all_affiliates  (includes read_all_affiliates)
├── manage_all_referrals   (includes read_all_referrals)
├── manage_all_payouts     (includes read_all_payouts)
└── read_all_visits
```

Granting a `manage_all_*` permission implicitly grants the corresponding `read_all_*` permission.

## How Permissions Are Stored

Permissions are stored in `fa_meta`:

| Column | Value |
|--------|-------|
| `object_type` | `user_meta` |
| `object_id` | WordPress user ID |
| `meta_key` | `_fa_access_permissions` |
| `value` | JSON array of granted permission keys |

Example stored value:
```json
["read_all_affiliates", "read_all_referrals", "read_all_visits"]
```

## REST API

All endpoints require `manage_options`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/wp-json/fluent-affiliate/v2/settings/managers` | List all managers and their permissions. |
| `POST` | `/wp-json/fluent-affiliate/v2/settings/managers` | Add or update a manager. |
| `DELETE` | `/wp-json/fluent-affiliate/v2/settings/managers/{id}` | Remove a manager. |

### Add a Manager

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/managers \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 12,
    "permissions": ["read_all_affiliates", "read_all_referrals", "read_all_payouts"]
  }'
```

### List Managers

```bash
curl https://yoursite.com/wp-json/fluent-affiliate/v2/settings/managers \
  -H "X-WP-Nonce: YOUR_NONCE"
```

Response:

```json
{
  "managers": [
    {
      "user_id": 12,
      "display_name": "Jane Smith",
      "email": "jane@example.com",
      "permissions": ["read_all_affiliates", "read_all_referrals"]
    }
  ],
  "permissions": {
    "read_all_affiliates": { "label": "View Affiliates" },
    "manage_all_affiliates": { "label": "Manage Affiliates" },
    ...
  }
}
```

## `PermissionManager` Class

The `PermissionManager` service class at `app/Services/PermissionManager.php` handles all permission checks.

| Method | Description |
|--------|-------------|
| `currentUserCan($permission)` | Check if the current user has a specific permission. |
| `userCan($userId, $permission)` | Check if a specific user ID has a permission. |
| `setPermissions($userId, $permissions)` | Assign permissions to a user. |
| `getPermissions($userId)` | Return permissions for a user. |
| `allPermissionSets()` | Return the full list of defined permission definitions. |

```php
use FluentAffiliate\App\Services\PermissionManager;

// Check in a custom plugin
$manager = new PermissionManager();

if ($manager->currentUserCan('read_all_referrals')) {
    // Show referral export button
}

// Grant permissions programmatically
$manager->setPermissions($userId, [
    'read_all_affiliates',
    'read_all_referrals',
]);
```

## Filter Hooks

The core `has_all_*` filters interact with the permission system. Returning `true` from these grants full access even without a stored permission:

```php
// Grant access to all affiliates for users with a custom role
add_filter('fluent_affiliate/has_all_affiliate_access', function($hasAccess) {
    if (current_user_can('my_affiliate_manager_role')) {
        return true;
    }
    return $hasAccess;
});

add_filter('fluent_affiliate/has_all_referral_access', function($hasAccess) {
    return $hasAccess;
});

add_filter('fluent_affiliate/has_all_payout_access', function($hasAccess) {
    return $hasAccess;
});

add_filter('fluent_affiliate/has_all_visit_access', function($hasAccess) {
    return $hasAccess;
});
```

### `fluent_affiliate/user_has_affiliate_access`

Low-level check for whether a user ID has any affiliate access at all.

```php
add_filter('fluent_affiliate/user_has_affiliate_access', function($hasAccess, $userId) {
    if (get_user_meta($userId, 'is_affiliate_partner', true)) {
        return true;
    }
    return $hasAccess;
}, 10, 2);
```

## Restrictions

- WordPress administrators (`manage_options`) always have full access regardless of the Permission Manager.
- Attempting to assign `manage_options` users as managers is blocked by the API.
- Permission checks occur in Policy classes. For custom routes, use the `PermissionManager` class directly.
