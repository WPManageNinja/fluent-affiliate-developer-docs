---
title: User Model
description: WordPress User model wrapper used in FluentAffiliate.
---

# User

FluentAffiliate wraps the WordPress `wp_users` table through a `User` model at `app/Models/User.php`.

**Table:** `wp_users` (WordPress core)

This model provides convenience methods for looking up users, creating affiliates from users, and managing affiliate registration.

## Key Methods

| Method | Description |
|--------|-------------|
| `createAffiliate($data)` | Create an affiliate record linked to this user. Fires `fluent_affiliate/affiliate_created`. |
| `getAffiliate()` | Return the linked `Affiliate` model, or `null`. |

