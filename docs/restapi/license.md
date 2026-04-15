---
title: License API
description: Pro license status retrieval, activation, and deactivation.
---

# License API <span class="pro-badge">PRO</span>

Pro license status retrieval, activation, and deactivation.

## Authentication

License routes are protected by `AdminPolicy` and require WordPress administrator access.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/settings/license` | <span class="pro-badge">PRO</span> | [Get License](/restapi/operations/license/get-license) | `LicenseController@getStatus` |
| `POST` | `/settings/license` | <span class="pro-badge">PRO</span> | [Save License](/restapi/operations/license/save-license) | `LicenseController@saveLicense` |
| `DELETE` | `/settings/license` | <span class="pro-badge">PRO</span> | [Delete License](/restapi/operations/license/delete-license) | `LicenseController@deactivateLicense` |

