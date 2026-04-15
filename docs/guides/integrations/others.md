---
title: Other Pro Integrations
description: LifterLMS, GiveWP, MemberPress, Paid Memberships Pro, TutorLMS, ProfilePress, Paymattic, FluentBooking, and Voxel integrations.
---

# Other Pro Integrations <span class="pro-badge">PRO</span>

FluentAffiliate Pro includes integrations with a broad range of membership, LMS, donation, and booking plugins. All follow the same [BaseConnector pattern](/guides/custom-integration).

## LifterLMS

**Detection constant:** `LLMS_PLUGIN_FILE`  
**Integration key:** `lifterlms`

Tracks commissions when a LifterLMS course or membership is purchased.

| Hook | Trigger |
|------|---------|
| `lifterlms_order_status_completed` | Order completed. |
| `lifterlms_order_status_refunded` | Order refunded. |

```php
add_filter('fluent_affiliate/formatted_order_data_by_lifterlms', function($data, $order) {
    return $data;
}, 10, 2);
```

## GiveWP

**Detection constant:** `GIVE_VERSION`  
**Integration key:** `give`

Tracks affiliate commissions from GiveWP donation form submissions.

| Hook | Trigger |
|------|---------|
| `give_recurring_subscription_completed` | Completed payment. |
| `give_donation_status_publish` | Donation published/completed. |

## MemberPress

**Detection constant:** `MEPR_PLUGIN_NAME`  
**Integration key:** `memberpress`

Tracks commissions when a MemberPress membership is purchased.

| Hook | Trigger |
|------|---------|
| `mepr-txn-store` | Transaction stored (payment completed). |
| `mepr-txn-refund` | Transaction refunded. |

```php
add_filter('fluent_affiliate/formatted_order_data_by_memberpress', function($data, $txn) {
    return $data;
}, 10, 2);
```

## Paid Memberships Pro (PMP)

**Detection constant:** `PMPRO_VERSION`  
**Integration key:** `pmpro`

Tracks commissions when a Paid Memberships Pro order is completed.

| Hook | Trigger |
|------|---------|
| `pmpro_after_checkout` | Checkout completed. |
| `pmpro_after_change_membership_level` | Membership downgraded/cancelled. |

## TutorLMS

**Detection constant:** `TUTOR_PRO_VERSION` (Pro version required)  
**Integration key:** `tutorlms`

Tracks commissions from TutorLMS course purchases.

| Hook | Trigger |
|------|---------|
| `tutor_course_complete_after` | Course enrollment completed. |

## ProfilePress

**Detection constant:** `PPRESS_VERSION_NUMBER`  
**Integration key:** `profilepress`

Tracks commissions when a ProfilePress membership plan is purchased.

| Hook | Trigger |
|------|---------|
| `ppress_after_plan_purchase` | Plan purchased. |
| `ppress_payment_refund` | Payment refunded. |

## Paymattic

**Detection constant:** `WPPAYFORM_VERSION`  
**Integration key:** `paymattic`

Tracks commissions from Paymattic payment form submissions.

| Hook | Trigger |
|------|---------|
| `wppayform/form_payment_success` | Payment successful. |
| `wppayform/payment_refunded` | Payment refunded. |

Paymattic also has a registration feed integration — see the [Fluent Forms guide](/guides/integrations/fluentforms) for the pattern (Paymattic uses the same feed approach).

The `fluent_affiliate/wppayform__defaults` filter lets you pre-fill form fields:

```php
add_filter('fluent_affiliate/wppayform__defaults', function($fields, $formId) {
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        $fields['email'] = $user->user_email;
    }
    return $fields;
}, 10, 2);
```

## FluentBooking

**Detection constant:** `FLUENT_BOOKING_VERSION`  
**Integration key:** `fluentbooking`

Tracks commissions from FluentBooking paid bookings.

| Hook | Trigger |
|------|---------|
| `fluent_booking/booking_payment_completed` | Booking payment completed. |
| `fluent_booking/booking_cancelled` | Booking cancelled/refunded. |

## Voxel

**Always loaded** (no detection constant required).  
**Integration key:** `voxel`

Tracks commissions from Voxel marketplace transactions.

> **Note:** Voxel is always initialised regardless of whether the Voxel plugin is active, because it uses Voxel's internal hook system that fires only when Voxel is loaded.

---

## Common Patterns

All integrations share the same filter hooks — only the `{provider}` segment changes:

### Modify Order Data Before Referral

```php
add_filter('fluent_affiliate/formatted_order_data_by_{provider}', function($data, $order) {
    // Normalise the order data
    return $data;
}, 10, 2);
```

Replace `{provider}` with: `lifterlms`, `give`, `memberpress`, `pmpro`, `tutorlms`, `profilepress`, `paymattic`, `fluentbooking`, `voxel`.

### Customise Admin Link for Referral

```php
add_filter('fluent_affiliate/provider_reference_{provider}_url', function($url, $referral) {
    return admin_url('your-plugin-order-page?id=' . $referral->provider_id);
}, 10, 2);
```

### Prevent Commission on Specific Products

```php
add_filter('fluent_affiliate/commission', function($commission, $context) {
    // Return 0 to skip recording (filtered by ignore_zero_amount_referral)
    if (in_array($context['product_id'] ?? 0, [99, 100])) {
        return 0;
    }
    return $commission;
}, 10, 2);
```
