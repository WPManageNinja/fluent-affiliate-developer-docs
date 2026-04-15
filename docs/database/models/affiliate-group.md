---
title: AffiliateGroup Model (Pro)
description: The AffiliateGroup model organises affiliates into commission tiers. Stored in fa_meta.
---

# AffiliateGroup <span class="pro-badge">PRO</span>

Affiliate groups let you assign custom commission rates to sets of affiliates. Groups are stored in the `fa_meta` table with `object_type = 'affiliate_group'`.

**Table:** `fa_meta` (polymorphic via `object_type = 'affiliate_group'`)  
**Class:** `FluentAffiliate\App\Models\AffiliateGroup`

## Storage Layout

| Column | Usage |
|--------|-------|
| `meta_key` | The group name (human-readable label). |
| `value` | Serialized JSON: `{ rate_type, rate, status, notes }` |
| `object_type` | Always `affiliate_group`. |
| `object_id` | Always `0` (not linked to a parent object). |

## Value Fields

| Field | Type | Description |
|-------|------|-------------|
| `rate_type` | `string` | Commission type: `percentage`, `flat`, or `default` (inherit global). |
| `rate` | `float` | Commission rate value. |
| `status` | `string` | Group status: `active` or `inactive`. |
| `notes` | `string` | Internal notes about the group. |

## Relationships

| Method | Type | Target | Description |
|--------|------|--------|-------------|
| `affiliates()` | `hasMany` | `Affiliate` | Affiliates assigned to this group via `group_id`. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `search($query)` | Full-text search on `meta_key` and `value` content. |

## Usage Example

```php
use FluentAffiliate\App\Models\AffiliateGroup;

// List all active groups
$groups = AffiliateGroup::all()->filter(function($g) {
    return ($g->value['status'] ?? '') === 'active';
});

// Get all affiliates in a specific group
$group = AffiliateGroup::find($groupId);
$affiliates = $group->affiliates()->ofStatus('active')->get();

// Assign an affiliate to a group
$affiliate->update(['group_id' => $group->id]);
```

## Commission Override Hierarchy

When calculating commission for an affiliate in a group, the rate is resolved in this order:

1. Affiliate's individual `rate` and `rate_type` (if set).
2. Group's `rate` and `rate_type` (if `rate_type !== 'default'`).
3. Global referral program defaults.

