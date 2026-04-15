---
title: Creative Model (Pro)
description: A marketing creative asset (banner, image, or text) managed in FluentAffiliate Pro.
---

# Creative <span class="pro-badge">PRO</span>

A marketing creative asset (banner, image, or text) managed in FluentAffiliate Pro.

**Table:** `fa_creatives`  
**Class:** `FluentAffiliate\\App\\Models\\Creative.php`

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `BIGINT(20)` | NO | — | Primary key, auto-increment. |
| `name` | `VARCHAR(255)` | NO | — | Creative asset name. |
| `description` | `TEXT` | YES | — | Free-text description. |
| `type` | `VARCHAR(100)` | NO | — | Creative type — `image`, `text`, `html`, `banner`. |
| `image` | `TEXT` | YES | — | URL of the creative image asset. |
| `text` | `TEXT` | YES | — | Text content for text-type creatives. |
| `url` | `TEXT` | YES | — | Destination URL linked from the creative. |
| `privacy` | `VARCHAR(100)` | YES | `public` | Visibility — `public` or `private`. |
| `status` | `VARCHAR(100)` | YES | `active` | Record status. |
| `affiliate_ids` | `JSON` | YES | — | JSON array of affiliate IDs this creative is restricted to. |
| `group_ids` | `JSON` | YES | — | JSON array of group IDs this creative is restricted to. |
| `meta` | `LONGTEXT` | YES | — | Additional metadata for the creative. |
| `created_at` | `TIMESTAMP` | YES | — | Timestamp when the record was created. |
| `updated_at` | `TIMESTAMP` | YES | — | Timestamp when the record was last updated. |

## Query Scopes

| Scope | Description |
|-------|-------------|
| `ofStatus($status)` | Filter by `status`. |
| `ofType($type)` | Filter by creative `type`. |
| `publicCreatives()` | Restrict to publicly visible creatives. |

## Usage Example

```php
use FluentAffiliatePro\App\Models\Creative;

$banners = Creative::ofStatus('active')
    ->ofType('image')
    ->publicCreatives()
    ->get();
```
