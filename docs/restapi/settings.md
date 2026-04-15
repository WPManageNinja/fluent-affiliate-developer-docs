---
title: Settings API
description: Email configuration, feature settings, integrations, referral config, page management, migrations, and registration fields.
---

# Settings API

Email configuration, feature settings, integrations, referral config, page management, migrations, and registration fields.

## Authentication

All settings routes are protected by `AdminPolicy` and require WordPress administrator access.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/settings/email-config` | Core | [Get Email Config](/restapi/operations/settings/get-email-config) | `SettingController@getEmailConfig` |
| `POST` | `/settings/email-config` | Core | [Update Email Config](/restapi/operations/settings/update-email-config) | `SettingController@updateEmailConfig` |
| `GET` | `/settings/email-config/emails` | Core | [List Email Templates](/restapi/operations/settings/list-email-templates) | `SettingController@getNotificationEmails` |
| `POST` | `/settings/email-config/emails` | Core | [Update Email Templates](/restapi/operations/settings/update-email-templates) | `SettingController@updateNotificationEmails` |
| `PATCH` | `/settings/email-config/emails` | Core | [Update Email Template](/restapi/operations/settings/update-email-template) | `SettingController@patchSingleNotificationEmail` |
| `GET` | `/settings/features` | Core | [List Features](/restapi/operations/settings/list-features) | `SettingController@getFeatures` |
| `GET` | `/settings/features/{feature_key}` | Core | [Get Feature Settings](/restapi/operations/settings/get-feature-settings) | `SettingController@getFeatureSettings` |
| `POST` | `/settings/features/{feature_key}` | Core | [Update Feature Settings](/restapi/operations/settings/update-feature-settings) | `SettingController@updateFeatureSettings` |
| `POST` | `/settings/addons/install` | Core | [Install Addon](/restapi/operations/settings/install-addon) | `SettingController@installAddon` |
| `GET` | `/settings/integrations` | Core | [List Integrations](/restapi/operations/settings/list-integrations) | `IntegrationController@index` |
| `GET` | `/settings/integration/config` | Core | [Get Integration Config](/restapi/operations/settings/get-integration-config) | `IntegrationController@getConfig` |
| `POST` | `/settings/integration/config` | Core | [Save Integration Config](/restapi/operations/settings/save-integration-config) | `IntegrationController@saveConfig` |
| `POST` | `/settings/integration/update-status` | Core | [Update Integration Status](/restapi/operations/settings/update-integration-status) | `IntegrationController@updateIntegrationStatus` |
| `GET` | `/settings/integration/product_cat_options` | Core | [Get Integration Product Options](/restapi/operations/settings/get-integration-product-options) | `IntegrationController@getCustomAffiliateOptions` |
| `GET` | `/settings/pages` | Core | [List Pages](/restapi/operations/settings/list-pages) | `SettingController@getPagesOptions` |
| `POST` | `/settings/create-page` | Core | [Create Page](/restapi/operations/settings/create-page) | `SettingController@createPage` |
| `GET` | `/settings/referral-config` | Core | [Get Referral Config](/restapi/operations/settings/get-referral-config) | `SettingController@getReferralConfig` |
| `POST` | `/settings/referral-config` | Core | [Update Referral Config](/restapi/operations/settings/update-referral-config) | `SettingController@saveReferralConfig` |
| `GET` | `/settings/migrations` | Core | [List Migrations](/restapi/operations/settings/list-migrations) | `MigrationController@getAvailableMigrations` |
| `POST` | `/settings/migrations/start` | Core | [Start Migration](/restapi/operations/settings/start-migration) | `MigrationController@startMigration` |
| `GET` | `/settings/migrations/status` | Core | [Get Migration Status](/restapi/operations/settings/get-migration-status) | `MigrationController@getPollingStatus` |
| `POST` | `/settings/migrations/wipe` | Core | [Wipe Data](/restapi/operations/settings/wipe-data) | `MigrationController@wipeCurrentData` |
| `GET` | `/settings/migrations/statistics` | Core | [Get Migration Statistics](/restapi/operations/settings/get-migration-statistics) | `MigrationController@getMigrationStatistics` |
| `GET` | `/settings/options/affiliates` | Core | [Get Affiliate Options](/restapi/operations/settings/get-affiliate-options) | `SettingController@getAffiliatesOptions` |
| `GET` | `/settings/options/users` | Core | [Get User Options](/restapi/operations/settings/get-user-options) | `SettingController@getUsersOptions` |
| `GET` | `/settings/registration-fields` | Core | [Get Registration Fields](/restapi/operations/settings/get-registration-fields) | `SettingController@getRegistrationFields` |
| `GET` | `/settings/options/affiliate-groups` | <span class="pro-badge">PRO</span> | [Get Affiliate Group Options](/restapi/operations/settings/get-affiliate-group-options) | `ProSettingController@getAffiliateGroupsOptions` |
| `POST` | `/settings/registration-fields` | <span class="pro-badge">PRO</span> | [Update Registration Fields](/restapi/operations/settings/update-registration-fields) | `ProSettingController@saveRegistrationFields` |
| `GET` | `/settings/managers` | <span class="pro-badge">PRO</span> | [List Managers](/restapi/operations/settings/list-managers) | `ProSettingController@getManagers` |
| `POST` | `/settings/managers` | <span class="pro-badge">PRO</span> | [Update Managers](/restapi/operations/settings/update-managers) | `ProSettingController@updateManager` |
| `DELETE` | `/settings/managers/{id}` | <span class="pro-badge">PRO</span> | [Delete Manager](/restapi/operations/settings/delete-manager) | `ProSettingController@deleteManager` |

