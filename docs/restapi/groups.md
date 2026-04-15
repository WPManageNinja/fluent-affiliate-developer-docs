---
title: Affiliate Groups API
description: Affiliate group CRUD operations, member listing, overview stats, and group statistics.
---

# Affiliate Groups API <span class="pro-badge">PRO</span>

Affiliate group CRUD operations, member listing, overview stats, and group statistics.

## Authentication

Affiliate group routes are protected by `AdminPolicy` and require WordPress administrator access.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/settings/groups` | <span class="pro-badge">PRO</span> | [List Groups](/restapi/operations/groups/list-groups) | `AffiliateGroupController@index` |
| `POST` | `/settings/groups` | <span class="pro-badge">PRO</span> | [Create Group](/restapi/operations/groups/create-group) | `AffiliateGroupController@store` |
| `PATCH` | `/settings/groups/{id}` | <span class="pro-badge">PRO</span> | [Update Group](/restapi/operations/groups/update-group) | `AffiliateGroupController@update` |
| `GET` | `/settings/groups/{id}` | <span class="pro-badge">PRO</span> | [Get Group](/restapi/operations/groups/get-group) | `AffiliateGroupController@show` |
| `GET` | `/settings/groups/{id}/affiliates` | <span class="pro-badge">PRO</span> | [List Group Affiliates](/restapi/operations/groups/list-group-affiliates) | `AffiliateGroupController@affiliates` |
| `GET` | `/settings/groups/{id}/overview` | <span class="pro-badge">PRO</span> | [Get Group Overview](/restapi/operations/groups/get-group-overview) | `AffiliateGroupController@overview` |
| `GET` | `/settings/groups/{id}/statistics` | <span class="pro-badge">PRO</span> | [Get Group Statistics](/restapi/operations/groups/get-group-statistics) | `AffiliateGroupController@statistics` |
| `DELETE` | `/settings/groups/{id}` | <span class="pro-badge">PRO</span> | [Delete Group](/restapi/operations/groups/delete-group) | `AffiliateGroupController@destroy` |

