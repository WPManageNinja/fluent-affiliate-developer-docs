---
title: Permissions (Pro)
description: Filter hooks in the Permissions (Pro) category.
---

# Permissions (Pro)

## Hook Reference

| Hook | Description |
|------|-------------|
| [`fluent_affiliate/has_all_affiliate_access`](#fluent-affiliate-has-all-affiliate-access) | Filters whether the current user has full access to all affiliates. |
| [`fluent_affiliate/has_all_referral_access`](#fluent-affiliate-has-all-referral-access) | Filters whether the current user has full access to all referrals. |
| [`fluent_affiliate/has_all_visit_access`](#fluent-affiliate-has-all-visit-access) | Filters whether the current user has full access to all visit records. |
| [`fluent_affiliate/has_all_payout_access`](#fluent-affiliate-has-all-payout-access) | Filters whether the current user has full access to all payout records. |
| [`fluent_affiliate/user_has_affiliate_access`](#fluent-affiliate-user-has-affiliate-access) | Filters whether a specific user ID has affiliate-level access. |

## `fluent_affiliate/has_all_affiliate_access`

Filters whether the current user has full access to all affiliates. Return `true` to grant access.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$hasAccess` | `bool` | Whether the user currently has full affiliate access. |

**Source:** `app/Services/PermissionManager.php`

```php
add_filter('fluent_affiliate/has_all_affiliate_access', function($hasAccess) {
    // Grant access to a custom role
    if (current_user_can('my_affiliate_manager_role')) {
        return true;
    }
    return $hasAccess;
});
```

## `fluent_affiliate/has_all_referral_access`

Filters whether the current user has full access to all referrals.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$hasAccess` | `bool` | Whether the user currently has full referral access. |

**Source:** `app/Services/PermissionManager.php`

```php
add_filter('fluent_affiliate/has_all_referral_access', '__return_true');
```

## `fluent_affiliate/has_all_visit_access`

Filters whether the current user has full access to all visit records.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$hasAccess` | `bool` | Whether the user currently has full visit access. |

**Source:** `app/Services/PermissionManager.php`

```php
add_filter('fluent_affiliate/has_all_visit_access', '__return_true');
```

## `fluent_affiliate/has_all_payout_access`

Filters whether the current user has full access to all payout records.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$hasAccess` | `bool` | Whether the user currently has full payout access. |

**Source:** `app/Services/PermissionManager.php`

```php
add_filter('fluent_affiliate/has_all_payout_access', '__return_true');
```

## `fluent_affiliate/user_has_affiliate_access`

Filters whether a specific user ID has affiliate-level access.

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$hasAccess` | `bool` | Current access state. |
| `$userId` | `int` | WordPress user ID being checked. |

**Source:** `app/Services/PermissionManager.php`

```php
add_filter('fluent_affiliate/user_has_affiliate_access', function($hasAccess, $userId) {
    if (get_user_meta($userId, 'is_affiliate_partner', true)) {
        return true;
    }
    return $hasAccess;
}, 10, 2);
```

