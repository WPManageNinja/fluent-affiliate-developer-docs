---
title: Visits API
description: Affiliate visit tracking records — listing and CSV export.
---

# Visits API

Affiliate visit tracking records — listing and CSV export.

## Authentication

Visit routes are protected by `VisitPolicy`. Admin users have full access; affiliate-level users require `read_all_visits`.

## Endpoints

| Method | Path | Edition | Operation | Controller |
| --- | --- | --- | --- | --- |
| `GET` | `/visits` | Core | [List Visits](/restapi/operations/visits/list-visits) | `VisitController@index` |
| `GET` | `/visits/export` | Core | [Export Visits](/restapi/operations/visits/export-visits) | `VisitController@export` |

