---
title: Connected Sites API
description: Connected site configuration management, token issuance, and site disconnect operations.
---

# Connected Sites API <span class="pro-badge">PRO</span>

Connected site configuration management, token issuance, and site disconnect operations.

## Authentication

Connected Sites routes are protected by `AdminPolicy` and require WordPress administrator access.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/settings/connected-sites-config` | <span class="pro-badge">PRO</span> | [Get Connected Sites Config](/restapi/operations/connected-sites/get-connected-sites-config) | `DomainController@getConnectedConfig` |
| `PATCH` | `/settings/connected-sites-config` | <span class="pro-badge">PRO</span> | [Update Connected Sites Status](/restapi/operations/connected-sites/update-connected-sites-status) | `DomainController@updateGlobalStatus` |
| `PATCH` | `/settings/connected-sites-config/update` | <span class="pro-badge">PRO</span> | [Update Connected Site](/restapi/operations/connected-sites/update-connected-site) | `DomainController@patchSingleSiteConfig` |
| `POST` | `/settings/connected-sites-config/issue` | <span class="pro-badge">PRO</span> | [Issue Site Token](/restapi/operations/connected-sites/issue-site-token) | `DomainController@validateAndIssueNewSiteToken` |
| `POST` | `/settings/connected-sites-config/disconnect` | <span class="pro-badge">PRO</span> | [Disconnect Site](/restapi/operations/connected-sites/disconnect-site) | `DomainController@disconnectSite` |

