---
title: FluentCRM Integration
description: How FluentAffiliate integrates with FluentCRM — automation triggers and actions, contact tag/list management from the affiliate profile, smart codes, imports, and advanced filters.
---

# FluentCRM Integration

When FluentCRM is active, FluentAffiliate boots `FluentAffiliate\App\Modules\FluentCRM\Init` on the `fluentcrm_loaded` hook (wired in `boot/app.php`). Everything below is skipped when FluentCRM is not installed — `CrmContactService::isActive()` simply checks `defined('FLUENTCRM')`.

## Automation Triggers

Four funnel triggers are registered under the **FluentAffiliate** category. Each wraps an existing FluentAffiliate hook:

| Trigger | Underlying hook | Fires when |
|---------|-----------------|------------|
| Affiliate Registered as Pending | `fluent_affiliate/affiliate_created` | A new affiliate registers |
| Affiliate Account Approved | `fluent_affiliate/affiliate_status_to_active` | An affiliate's status becomes `active` |
| Successful Referral Created | `fluent_affiliate/referral_marked_unpaid` | A referral is confirmed on a paid order |
| Affiliate Payout Sent | `fluent_affiliate/payout/transaction/transaction_updated_to_paid` | A payout transaction is marked paid |

## Automation Action

`create_affiliate_account` — **Create Affiliate Account**. Creates an affiliate record for the contact's linked WordPress user from inside a FluentCRM funnel, with configurable commission rate type (default / percentage / flat).

## Contact Info Widget

`Init::pushInfoWidgetToContact()` hooks `fluent_crm/subscriber_info_widgets` and adds an **Affiliate Profile** panel to the FluentCRM contact screen when the contact's WordPress user has an affiliate record. It shows affiliate ID (linked to the admin screen), status, commission rate, total and unpaid earnings, referral count, and visit count.

## CRM Profile Card on the Affiliate

The single-affiliate admin screen shows a CRM card with the contact's tags and lists, and lets an admin edit them in place.

`GET /affiliates/{id}` attaches `crm_profile` (via `CrmContactService::getProfileData()`) when FluentCRM is active **and** the current user has `fcrm_read_contacts`:

```php
[
    'contact_id'  => 12,
    'photo'       => 'https://…',
    'full_name'   => 'Jane Doe',
    'status'      => 'subscribed',
    'profile_url' => 'https://site.test/wp-admin/admin.php?page=fluentcrm-admin#/subscribers/12',
    'stats'       => [ /* FluentCRM contact stats */ ],
    'tag_ids'     => [3, 8],
    'list_ids'    => [1],
    'tags'        => [['id' => 3, 'title' => 'Partners']],
    'lists'       => [['id' => 1, 'title' => 'Newsletter']],
    'editable'    => true,   // current user has fcrm_manage_contacts
]
```

The contact is resolved from the affiliate's `user_id` via `FluentCrmApi('contacts')->getContactByUserRef()`. No linked user or no matching contact → `null`, and the card is not rendered.

### Endpoints

| Method | Path | Capability | Purpose |
|--------|------|------------|---------|
| `GET` | `/affiliates/{id}/crm-contact` | `fcrm_read_contacts` | Current tag/list selection |
| `GET` | `/affiliates/{id}/crm-options` | `fcrm_read_contacts` | Searchable tag/list options for the picker |
| `POST` | `/affiliates/{id}/crm-contact/tags` | `fcrm_manage_contacts` | Sync the contact's tags |
| `POST` | `/affiliates/{id}/crm-contact/lists` | `fcrm_manage_contacts` | Sync the contact's lists |

Behaviour worth knowing:

- **Options are bounded** — `crm-options` returns at most 50 rows, ordered by title, optionally narrowed by `search` (`LIKE`, with `%`/`_` escaped). Pass `type=lists` for lists; anything else means tags.
- **Sync is declarative** — you send the full desired id set (`tag_ids` or `list_ids`) and the service computes attach/detach diffs. Ids FluentCRM does not recognise are dropped.
- **Payloads are capped** — the controller casts to `int`, de-duplicates, and slices to 200 ids before the `WHERE IN` query.
- The response returns the fresh `tag_ids` and `list_ids` so the UI can re-sync without a second request.

```bash
curl -X POST https://site.test/wp-json/fluent-affiliate/v2/affiliates/42/crm-contact/tags \
  -u "admin:APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"tag_ids": [3, 8]}'
```

Both endpoints fail with a plain error message — not a silent no-op — when FluentCRM is inactive, the capability is missing, or the affiliate has no CRM contact.

## Smart Codes

Affiliate data is exposed to FluentCRM email and funnel templates through three smart-code groups, registered on `fluent_crm/smartcode_group_callback_*`:

| Group | Resolves to |
|-------|-------------|
| `fa_affiliate` | The contact's affiliate record |
| `fa_transaction` | The funnel's source transaction, else the affiliate's latest transaction |
| `fa_referral` | The funnel's source referral, else the affiliate's latest referral |

Each callback re-emits the value through `fluent_affiliate/parse_smart_codes`, so any smart code you register on the FluentAffiliate side is available inside FluentCRM too. Context-specific codes are also pushed onto `fluent_crm_funnel_context_smart_codes` — transaction codes for the payout-paid context, referral codes for the referral context.

## Deep Integration

`DeepIntegration` adds FluentAffiliate as a first-class data source inside FluentCRM:

- **Contact import** — registers the `fluent_affiliate` import driver (`fluent_crm/import_providers`), so affiliates can be imported as contacts.
- **Advanced filters** — `fluentcrm_advanced_filter_options` and `fluentcrm_contacts_filter_fluent_affiliate` let you segment contacts by affiliate properties.
- **Automation conditions** — the same option set is exposed through `fluentcrm_automation_condition_groups`, assessed by `fluentcrm_automation_conditions_assess_fluent_affiliate`.
- **General smart codes** — `fluent_crm/extended_smart_codes`.

## Related

- [Affiliate model](/database/models/affiliate)
- [Affiliates API](/restapi/affiliates)
- [Action Hooks](/hooks/actions/)
