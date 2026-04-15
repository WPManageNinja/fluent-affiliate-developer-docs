---
title: Fluent Forms Integration (Core)
description: Register new affiliates automatically via a Fluent Forms submission feed.
---

# Fluent Forms Integration

The Fluent Forms integration is bundled with **FluentAffiliate core**. It lets you create an affiliate registration form using Fluent Forms and automatically create an affiliate account on form submission.

**Detection constant:** `FLUENTFORM_VERSION`  
**Integration key:** `fluentforms`

## Setup

1. Create a Fluent Forms form with the fields you need (name, email, payment email, etc.).
2. Go to **Form Settings → Feed** and add a **FluentAffiliate** feed.
3. Map form fields to affiliate fields.
4. On submission, a new affiliate is created and the `fluent_affiliate/affiliate_created_via_fluent_form` action fires.

## Action Hook

### `fluent_affiliate/affiliate_created_via_fluent_form`

Fires after the affiliate is created via a Fluent Forms feed.

```php
add_action('fluent_affiliate/affiliate_created_via_fluent_form', function($affiliate, $user, $feedData) {
    // $affiliate — newly created Affiliate model
    // $user      — associated WP_User
    // $feedData  — the Fluent Forms feed configuration data

    // Example: sync to a CRM
    my_crm_add_affiliate([
        'email'  => $affiliate->payment_email,
        'name'   => $user->display_name,
        'ref_id' => $affiliate->custom_param,
    ]);
}, 10, 3);
```

## Configuration Fields

The Fluent Forms feed maps these affiliate fields:

| Affiliate Field | Description |
|-----------------|-------------|
| `payment_email` | PayPal or payment email address. |
| `custom_param` | Custom referral URL parameter. |
| `rate_type` | Commission type (`percentage` or `flat`). |
| `rate` | Commission rate. |
| `note` | Internal note. |
| `settings` | JSON settings blob. |

## Auto-Approval

By default, affiliates created via Fluent Forms go into `pending` status. To auto-approve:

```php
add_filter('fluent_affiliate/auth/auto_approve_affiliates', '__return_true');
```

Or apply it only to form-created affiliates:

```php
add_action('fluent_affiliate/affiliate_created_via_fluent_form', function($affiliate) {
    if ($affiliate->status === 'pending') {
        $affiliate->update(['status' => 'active']);
    }
});
```
