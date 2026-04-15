---
title: Meta Model
description: Generic key-value meta storage for affiliate and other objects.
---

# Meta

Generic key-value meta storage for affiliate and other objects.

**Table:** `fa_meta`  
**Class:** `FluentAffiliate\\App\\Models\\Meta.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT` | NO | — | Primary key, auto-increment. |
| `object_type` | `VARCHAR(50)` | NO | — | Type of object this meta belongs to (e.g. `affiliate`). |
| `object_id` | `BIGINT` | YES | — | ID of the associated object. |
| `meta_key` | `VARCHAR(192)` | NO | — | Meta key. |
| `value` | `LONGTEXT` | YES | — | Meta value (serialized if complex). |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `ofObjectType($type)` | Filter by `object_type`. |
| `ofObjectId($id)` | Filter by `object_id`. |

## Usage Example

```php
use FluentAffiliate\App\Models\Meta;

$value = Meta::where('object_type', 'affiliate')
    ->where('object_id', $affiliateId)
    ->where('meta_key', 'custom_rate_override')
    ->value('value');
```
