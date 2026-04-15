---
title: Settings API
description: REST API endpoints for Settings.
---

# Settings

**Base URL:** `https://yoursite.com/wp-json/fluent-affiliate/v2`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/settings/email-config` | Get email notification configuration. |
| `POST` | `/settings/email-config` | Update email notification configuration. |
| `GET` | `/settings/email-config/emails` | List all notification email templates. |
| `POST` | `/settings/email-config/emails` | Update all notification email templates. |
| `PATCH` | `/settings/email-config/emails` | Update a single notification email template. |
| `GET` | `/settings/features` | List all feature modules. |
| `GET` | `/settings/features/{feature_key}` | Get settings for a specific feature. |
| `POST` | `/settings/features/{feature_key}` | Update settings for a specific feature. |
| `POST` | `/settings/addons/install` | Install an addon. |
| `GET` | `/settings/integrations` | List registered integrations. |
| `GET` | `/settings/integration/config` | Get configuration for an integration. |
| `POST` | `/settings/integration/config` | Save integration configuration. |
| `POST` | `/settings/integration/update-status` | Enable or disable an integration. |
| `GET` | `/settings/integration/product_cat_options` | Get product/category options for an integration. |
| `GET` | `/settings/pages` | Get a list of WordPress pages for the portal page selector. |
| `POST` | `/settings/create-page` | Create a new WordPress page for the portal. |
| `GET` | `/settings/referral-config` | Get the referral program configuration. |
| `POST` | `/settings/referral-config` | Save the referral program configuration. |
| `GET` | `/settings/migrations` | List available data migrators. |
| `POST` | `/settings/migrations/start` | Start a data migration. |
| `GET` | `/settings/migrations/status` | Poll the status of a running migration. |
| `POST` | `/settings/migrations/wipe` | Wipe all FluentAffiliate data. |
| `GET` | `/settings/migrations/statistics` | Get migration statistics. |
| `GET` | `/settings/options/affiliates` | Get affiliate options for select inputs. |
| `GET` | `/settings/options/users` | Get WordPress user options for select inputs. |
| `GET` | `/settings/registration-fields` | Get affiliate registration field configuration. |
| `GET` | `/settings/options/affiliate-groups` | Get affiliate group options for select inputs. |
| `POST` | `/settings/registration-fields` | Save affiliate registration field configuration. |
| `GET` | `/settings/managers` | List affiliate managers. |
| `POST` | `/settings/managers` | Add or update an affiliate manager. |
| `DELETE` | `/settings/managers/{id}` | Remove an affiliate manager. |

## `GET /settings/email-config`

Get email notification configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getEmailConfig`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/email-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/email-config`

Update email notification configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::updateEmailConfig`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/email-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/email-config/emails`

List all notification email templates.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getNotificationEmails`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/email-config/emails \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/email-config/emails`

Update all notification email templates.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::updateNotificationEmails`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/email-config/emails \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `PATCH /settings/email-config/emails`

Update a single notification email template.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::patchSingleNotificationEmail`

```bash
curl -X PATCH \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/email-config/emails \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/features`

List all feature modules.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getFeatures`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/features \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/features/{feature_key}`

Get settings for a specific feature.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getFeatureSettings`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/features/VALUE \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/features/{feature_key}`

Update settings for a specific feature.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::updateFeatureSettings`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/features/VALUE \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/addons/install`

Install an addon.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::installAddon`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/addons/install \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/integrations`

List registered integrations.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `IntegrationController::index`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/integrations \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/integration/config`

Get configuration for an integration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `IntegrationController::getConfig`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/integration/config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/integration/config`

Save integration configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `IntegrationController::saveConfig`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/integration/config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/integration/update-status`

Enable or disable an integration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `IntegrationController::updateIntegrationStatus`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/integration/update-status \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/integration/product_cat_options`

Get product/category options for an integration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `IntegrationController::getCustomAffiliateOptions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/integration/product_cat_options \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/pages`

Get a list of WordPress pages for the portal page selector.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getPagesOptions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/pages \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/create-page`

Create a new WordPress page for the portal.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::createPage`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/create-page \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/referral-config`

Get the referral program configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getReferralConfig`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/referral-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/referral-config`

Save the referral program configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::saveReferralConfig`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/referral-config \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/migrations`

List available data migrators.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `MigrationController::getAvailableMigrations`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/migrations \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/migrations/start`

Start a data migration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `MigrationController::startMigration`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/migrations/start \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/migrations/status`

Poll the status of a running migration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `MigrationController::getPollingStatus`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/migrations/status \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/migrations/wipe`

Wipe all FluentAffiliate data.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `MigrationController::wipeCurrentData`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/migrations/wipe \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/migrations/statistics`

Get migration statistics.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `MigrationController::getMigrationStatistics`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/migrations/statistics \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/options/affiliates`

Get affiliate options for select inputs.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getAffiliatesOptions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/options/affiliates \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/options/users`

Get WordPress user options for select inputs.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getUsersOptions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/options/users \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/registration-fields`

Get affiliate registration field configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `SettingController::getRegistrationFields`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/registration-fields \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/options/affiliate-groups`

Get affiliate group options for select inputs.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `ProSettingController::getAffiliateGroupsOptions`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/options/affiliate-groups \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/registration-fields`

Save affiliate registration field configuration.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `ProSettingController::saveRegistrationFields`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/registration-fields \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `GET /settings/managers`

List affiliate managers.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `ProSettingController::getManagers`

```bash
curl -X GET \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/managers \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `POST /settings/managers`

Add or update an affiliate manager.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `ProSettingController::updateManager`

```bash
curl -X POST \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/managers \
  -H "X-WP-Nonce: YOUR_NONCE"
```

## `DELETE /settings/managers/{id}`

Remove an affiliate manager.

**Auth:** WordPress administrator (`manage_options`)  
**Controller:** `ProSettingController::deleteManager`

```bash
curl -X DELETE \
  https://yoursite.com/wp-json/fluent-affiliate/v2/settings/managers/1 \
  -H "X-WP-Nonce: YOUR_NONCE"
```

