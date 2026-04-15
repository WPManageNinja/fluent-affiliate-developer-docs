---
title: Creatives API
description: Creative asset management (admin) and portal creative retrieval for authenticated affiliates.
---

# Creatives API <span class="pro-badge">PRO</span>

Creative asset management (admin) and portal creative retrieval for authenticated affiliates.

## Authentication

Admin creative routes are protected by `AdminPolicy`. The portal creatives endpoint uses `UserPolicy`.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/settings/creatives` | <span class="pro-badge">PRO</span> | [List Creatives](/restapi/operations/creatives/list-creatives) | `CreativeController@index` |
| `GET` | `/settings/creatives/{id}` | <span class="pro-badge">PRO</span> | [Get Creative](/restapi/operations/creatives/get-creative) | `CreativeController@show` |
| `POST` | `/settings/creatives` | <span class="pro-badge">PRO</span> | [Create Creative](/restapi/operations/creatives/create-creative) | `CreativeController@store` |
| `PATCH` | `/settings/creatives/{id}` | <span class="pro-badge">PRO</span> | [Update Creative](/restapi/operations/creatives/update-creative) | `CreativeController@update` |
| `DELETE` | `/settings/creatives/{id}` | <span class="pro-badge">PRO</span> | [Delete Creative](/restapi/operations/creatives/delete-creative) | `CreativeController@destroy` |
| `GET` | `/portal/creatives` | <span class="pro-badge">PRO</span> | [List Portal Creatives](/restapi/operations/creatives/list-portal-creatives) | `CreativeController@portalCreatives` |

