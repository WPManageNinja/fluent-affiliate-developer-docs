---
title: Custom Registration Fields (Pro)
description: Add custom fields to the affiliate registration form — field types, storage in fa_affiliates.custom_fields, validation, and the hooks that drive them.
---

# Custom Registration Fields <span class="pro-badge">PRO</span>

FluentAffiliate Pro lets admins add custom fields to the affiliate registration form. Submitted values are stored per affiliate and surfaced in both the admin affiliate profile and the affiliate portal's settings screen.

Managed under **Settings → Registration → Registration Fields** in the admin SPA.

## Field Types

`CustomRegistrationFieldsService::getFieldTypes()` returns a fixed catalogue — the set is intentionally **not** filterable, because each type also needs a renderer, a sanitizer branch, and a portal mapping:

| Type | Label | Notes |
|------|-------|-------|
| `text` | Text | `sanitize_text_field` |
| `textarea` | Textarea | `sanitize_textarea_field` |
| `number` | Number | Cast with `floatval`, non-numeric → `''` |
| `date` | Date | Must match `Y-m-d` exactly |
| `select` | Dropdown | Value must be one of the configured options |
| `radio` | Radio | Value must be one of the configured options |
| `url` | URL | `sanitize_url` |
| `multiselect` | Multi Select | Array of option values, deduplicated |

The type list is also pushed to the admin SPA through `fluent_affiliate/admin_vars` as `registration_custom_field_types`.

## Field Definition

A sanitized custom field looks like this:

```php
[
    'name'              => 'cf_company',   // auto-generated, always cf_-prefixed, max 40 chars
    'label'             => 'Company',
    'type'              => 'text',
    'placeholder'       => 'Acme Inc.',    // dropped for radio/multiselect/date/select
    'help_text'         => '',
    'options'           => [],             // only for select/radio/multiselect
    'required'          => 'no',           // 'yes' | 'no'
    'enabled'           => 'yes',          // 'yes' | 'no'
    'custom'            => 'yes',          // marks it as a custom field
    'system_defined'    => 'no',
    'disable_alter'     => 'no',
    'sanitize_callback' => 'sanitize_text_field',
]
```

Names are derived from the label with `sanitize_title()`, `-` replaced by `_`, forced to a `cf_` prefix so they can never collide with system field names (`full_name`, `email`, `username`, `password`, …), truncated to 40 characters, and de-duplicated with a numeric suffix.

Definitions are saved in the `_registration_fields` option alongside the built-in fields, via `POST /settings/registration-fields`.

## Storage

Values live in the `custom_fields` JSON column on `fa_affiliates`, keyed by field name:

```json
{ "cf_company": "Acme Inc.", "cf_channels": ["blog", "youtube"] }
```

The `Affiliate` model casts the column both ways — reading returns an array, and assigning an array JSON-encodes it:

```php
$affiliate->custom_fields;                       // ['cf_company' => 'Acme Inc.']
$affiliate->custom_fields = ['cf_company' => 'X']; // stored as JSON
```

The column is added by `AffiliatesMigrator` — both in the `CREATE TABLE` statement and as an `ALTER TABLE` in the DB-version migration for existing installs. `CustomRegistrationFieldsService::hasValueColumn()` guards against a site where the `ALTER` never ran: when the column is missing, custom values are skipped rather than risking a failed write that would break registration entirely.

## Validation

`CustomRegistrationFieldsService::sanitizeAndValidateValues()` runs per submission:

- Disabled fields are skipped.
- Each value is sanitized by type (choice values must match a configured option, or become `''`).
- A `required` field that resolves to `''` (or an empty array) throws — surfaced as a `WP_Error` with the message `"<Label> is required"`.
- Free-text values are capped at **5000 characters** (`MAX_VALUE_LENGTH`), mirroring `bank_details`.
- `multiselect` values are deduplicated and bounded by the option list.

## Lifecycle Hooks

`CustomRegistrationFieldsHandler` wires the feature through four filters:

| Hook | What it does |
|------|--------------|
| [`fluent_affiliate/admin_vars`](/hooks/filters/settings#fluent-affiliate-admin-vars) | Exposes the field-type catalogue to the admin SPA |
| [`fluent_affiliate/auth/custom_field_values`](/hooks/filters/auth#fluent-affiliate-auth-custom-field-values) | Sanitizes + validates submitted values on registration and portal profile save |
| [`fluent_affiliate/affiliate_view_data`](/hooks/filters/affiliates#fluent-affiliate-affiliate-view-data) | Appends `custom_field_details` (label/value pairs) to the admin affiliate profile |
| [`fluent_affiliate/portal/settings_data`](/hooks/filters/portal#fluent-affiliate-portal-settings-data) | Injects the fields and their current values into the portal settings form |

Values are persisted by the auth layer (`AuthHandler`) on registration and merged by `PortalController` when an affiliate updates their profile:

```php
$affiliate->custom_fields = array_merge((array) $affiliate->custom_fields, $customValues);
```

## Adding Your Own Field Values

Because the collection hook accumulates, a third-party plugin can add values without touching the Pro feature. **Merge into** the incoming array — replacing it would drop values collected by earlier callbacks:

```php
add_filter('fluent_affiliate/auth/custom_field_values', function ($values, $fields, $submitted) {
    if (empty($submitted['cf_vat_id'])) {
        return new \WP_Error('validation_failed', __('VAT ID is required.', 'my-plugin'));
    }

    $values['cf_vat_id'] = sanitize_text_field($submitted['cf_vat_id']);

    return $values;
}, 20, 3);
```

Returning a `WP_Error` aborts registration with a 422 and shows the error message on the form.

## Portal Field Mapping

When the portal settings form is built, each custom type maps to a portal control:

| Field type | Portal control |
|------------|----------------|
| `multiselect` | `checkbox` with options |
| `select` | `select` with options |
| `radio` | `radio` with options |
| `textarea` | `textarea` |
| `date` | `date` |
| everything else | `text` (with `data_type` of `number` or `url` where applicable) |

## REST API

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/settings/registration-fields` | Current field definitions (Core) |
| `POST` | `/settings/registration-fields` | Save field definitions and registration settings <span class="pro-badge">PRO</span> |

See [Get Registration Fields](/restapi/operations/settings/get-registration-fields) and [Update Registration Fields](/restapi/operations/settings/update-registration-fields).

## Related

- [Captcha](/guides/captcha)
- [Portal Customization](/guides/portal-customization)
- [Affiliate model](/database/models/affiliate)
